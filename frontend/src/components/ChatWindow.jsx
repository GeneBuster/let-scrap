import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

export const ChatWindow = ({ scrapRequest, onBack }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // --- Logged-in user ---
  const userData = JSON.parse(localStorage.getItem("userInfo"));
  const currentUserId = userData?.id;
  const token = userData?.token;


  // --- Join room + fetch history ---
  useEffect(() => {
    if (!socket || !scrapRequest) return;

    const roomId = scrapRequest._id;
    socket.emit("joinRoom", roomId);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/messages/${roomId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    fetchMessages();

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      // Only add if it belongs to this request
      if (message.requestId === roomId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, scrapRequest]);

  // --- Auto scroll on update ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Send message ---
  const handleSend = async () => {
    if (!input.trim()) return;
    if (!socket) {
      console.warn("Socket not ready yet");
      return;
    }

    const newMessage = {
      text: input.trim(),
      senderId: currentUserId,
      requestId: scrapRequest._id,
    };

    // Send via socket only — don’t double-add
    socket.emit("sendMessage", newMessage);

    // Clear input immediately
    setInput("");
  };

  if (!scrapRequest) {
    return (
      <div className="p-6 text-center text-gray-500">
        Select a request to start chatting.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg shadow bg-white overflow-hidden">
      {/* --- Header --- */}
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="font-semibold text-gray-700">
            Chat with{" "}
            {scrapRequest?.user?.name || scrapRequest?.dealer?.name || "Partner"}
          </h2>
        </div>
      </div>

      {/* --- Messages List --- */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, i) => {
            const isMine =
              msg.senderId === currentUserId ||
              msg.senderId?._id === currentUserId; // handle populated data

            return (
              <div
                key={i}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[70%] break-words shadow ${isMine
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-[10px] opacity-70 mt-1 text-right">
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- Input Area --- */}
      <div className="flex items-center border-t px-3 py-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 border-none outline-none text-sm px-2 py-1"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`ml-2 px-4 py-1 rounded text-white transition ${input.trim()
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};
