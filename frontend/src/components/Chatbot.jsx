// frontend/src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi there! I'm Atlas Coffee A.I. — your virtual barista. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleToggle = () => {
    console.log("🤖 Chatbot toggle clicked. Current state:", open);
    setOpen(!open);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Get user email from localStorage
      const userEmail = localStorage.getItem("email") || null;

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg.text,
          userEmail: userEmail 
        }),
      });
      const data = await res.json();

      const botMsg = {
        role: "bot",
        text:
          data.reply ||
          "☕ Sorry, I'm having trouble understanding that right now.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ I’m having trouble connecting right now.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[#6B4226] to-[#9c6644] text-white p-4 rounded-full shadow-lg hover:opacity-90 transition z-50"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 animate-slide-up border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6B4226] to-[#9c6644] text-white px-5 py-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Atlas Coffee A.I.</h3>
              <p className="text-sm text-white/80">Always here for you ☕</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white hover:opacity-80">
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 bg-[#F8F8F8] p-4 overflow-y-auto space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#6B4226] to-[#9c6644] text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-400 mt-1 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border px-4 py-2 rounded-2xl text-sm text-gray-500 animate-pulse">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t p-3 flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9c6644]"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="ml-2 bg-gradient-to-r from-[#6B4226] to-[#9c6644] text-white p-2 rounded-full hover:opacity-90 transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
