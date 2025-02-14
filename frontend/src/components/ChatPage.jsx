import React, { useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Navbar from "../components/Navbar";
import ChatSessions from "../components/ChatSessions";
import ChatBox from "../components/ChatBox";
import { useUser } from "../context/UserContext";

const client = new W3CWebSocket(process.env.REACT_APP_WEBSOCKET_URL);

const ChatPage = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem("sessions"));
    if (storedSessions) {
      setSessions(storedSessions);
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (activeSession) {
      const session = sessions.find(
        (session) => session.name === activeSession
      );
      setMessages(session ? session.messages : []);

      client.onmessage = (message) => {
        const receivedMessage = { sender: "server", text: message.data };

        const updatedMessages = [...messages, receivedMessage];
        setMessages(updatedMessages);

        const updatedSessions = sessions.map((session) =>
          session.name === activeSession
            ? { ...session, messages: updatedMessages }
            : session
        );
        setSessions(updatedSessions);
        localStorage.setItem("sessions", JSON.stringify(updatedSessions));
      };
    }
  }, [activeSession, sessions, messages]);

  const sendMessage = () => {
    if (input.trim() && activeSession) {
      if (client.readyState === WebSocket.OPEN) {
        const updatedMessages = [...messages, { sender: "user", text: input }];
        setMessages(updatedMessages);

        const updatedSessions = sessions.map((session) =>
          session.name === activeSession
            ? { ...session, messages: updatedMessages }
            : session
        );
        setSessions(updatedSessions);

        client.send(input);
        setInput("");
      }
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.style.height = "auto";
      } else {
        console.error("WebSocket is not open. Unable to send message.");
      }
    }
  };

  const createSession = (name) => {
    const sessionExists = sessions.some((session) => session.name === name);
    if (sessionExists) {
      alert("Session already exists!");
      return;
    }

    const newSession = { name, messages: [] };
    const updatedSessions = [...sessions, newSession];

    setSessions(updatedSessions);
    setActiveSession(name);

    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
  };

  const selectSession = (sessionName) => {
    setActiveSession(sessionName);
    const session = sessions.find((s) => s.name === sessionName);
    setMessages(session ? session.messages : []);
  };

  const deleteSession = (sessionName) => {
    const updatedSessions = sessions.filter(
      (session) => session.name !== sessionName
    );
    setSessions(updatedSessions);

    if (activeSession === sessionName) {
      setActiveSession(null);
      setMessages([]);
    }

    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
  };

  const renameSession = (oldName, newName) => {
    if (newName.trim() === "") {
      alert("Session name cannot be empty!");
      return;
    }

    const sessionExists = sessions.some((session) => session.name === newName);
    if (sessionExists) {
      alert("Session name already exists!");
      return;
    }

    const updatedSessions = sessions.map((session) =>
      session.name === oldName ? { ...session, name: newName } : session
    );
    setSessions(updatedSessions);

    if (activeSession === oldName) {
      setActiveSession(newName);
    }

    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <div className="w-full md:w-1/4 bg-slate-300 md:h-full">
          <ChatSessions
            onCreateSession={createSession}
            sessions={sessions}
            onSelectSession={selectSession}
            onDeleteSession={deleteSession}
            onRenameSession={renameSession}
          />
        </div>
        <div className="flex flex-col flex-grow rounded-lg border-r">
          {activeSession ? (
            <ChatBox
              messages={messages}
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              session={activeSession}
            />
          ) : (
            <div className="flex items-center justify-center flex-grow text-gray-500">
              <p>Select a session to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
