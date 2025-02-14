import React, { useEffect, useRef, useState } from "react";
import { HiUserCircle } from "react-icons/hi";

const ChatBox = ({ messages, input, setInput, sendMessage, session }) => {
  const chatEndRef = useRef(null);
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col pb-6 bg-white shadow-xl h-full">
      <div className="flex justify-between w-full bg-slate-800">
        {session && (
          <div className="flex gap-3 text-xl font-semibold text-white py-5 px-10 items-center w-full">
            <HiUserCircle className="size-10" />
            {session}
          </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto mb-4 space-y-4 custom-scroll px-10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`group flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } relative`}
          >
            <div
              className={`relative px-5 py-3 rounded-xl max-w-xs shadow-md ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                  : "bg-gradient-to-br from-gray-300 to-gray-300 text-gray-800"
              } transition-all duration-300 ease-in-out transform hover:scale-105`}
              style={{ position: "relative", overflow: "visible" }}
            >
              {msg.text}

              <span
                className={`absolute w-0 h-0 border-[10px] border-transparent ${
                  msg.sender === "user"
                    ? "border-b-blue-500 right-[-10px] bottom-0"
                    : "border-b-gray-300 left-[-10px] bottom-0"
                }`}
              ></span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex mt-4 space-x-4 items-end px-6">
        <textarea
          className="flex-grow p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 resize-none custom-scroll"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          style={{ overflowY: "auto", maxHeight: "160px" }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md h-[50px]"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
