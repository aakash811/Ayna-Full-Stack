import React, { useState } from "react";
import { HiOutlinePencil, HiOutlineTrash, HiTrash } from "react-icons/hi";
import { HiUserCircle, HiDotsVertical } from "react-icons/hi";
import { Menu } from "@headlessui/react";

const ChatSessions = ({
  onCreateSession,
  sessions,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
}) => {
  const [sessionName, setSessionName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [renamingSession, setRenamingSession] = useState(null);
  const [newName, setNewName] = useState("");

  const handleCreateSession = () => {
    if (sessionName.trim()) {
      onCreateSession(sessionName);
      setSessionName("");
      setIsOpen(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleRename = (oldName) => {
    if (newName.trim()) {
      onRenameSession(oldName, newName);
      setRenamingSession(null);
      setNewName("");
    }
  };

  return (
    <div className="flex flex-col p-4 space-y-4 rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Chat Sessions</h2>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          + Create Session
        </button>
      </div>

      <div className="space-y-3">
        {sessions.length > 0 ? (
          sessions.map((session, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between cursor-pointer bg-gray-100 p-4 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all duration-200 ease-in-out"
              onClick={() => onSelectSession(session.name)}
            >
              <div className="flex items-center space-x-4">
                <HiUserCircle className="text-gray-500 text-3xl" />
                <div className="font-bold text-gray-800">{session.name}</div>
              </div>

              <Menu as="div" className="relative">
                <Menu.Button className="text-gray-600 hover:text-gray-800">
                  <HiDotsVertical />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg focus:outline-none z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingSession(session.name);
                        }}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-800"
                        } w-full text-left px-4 py-2 text-sm flex gap-2 items-center rounded-t-md`}
                      >
                        <HiOutlinePencil />
                        Rename
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.name);
                        }}
                        className={`${
                          active ? "bg-red-500 text-white" : "text-gray-800"
                        } flex gap-2 w-full text-left px-4 py-2 text-sm items-center rounded-b-md`}
                      >
                        <HiTrash />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No active sessions</p>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Create a New Session</h3>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter session name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSession}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}

      {renamingSession && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Rename Session</h3>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="New session name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRenamingSession(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRename(renamingSession)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSessions;
