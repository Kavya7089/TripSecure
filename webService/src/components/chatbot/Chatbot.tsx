import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { useAppStore } from "../../lib/store";

interface Message {
  id: string;
  sender: "user" | "ai" | "loading";
  text: string;
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    const loadingId = `load-${Date.now()}`;
    const loadingMsg: Message = { id: loadingId, sender: "loading", text: "" };
    setMessages((msgs) => [...msgs, loadingMsg]);

    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("http://localhost:5000/api/groq/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const aiText = data.response || "Sorry, I couldn't get a response.";

      setMessages((msgs) =>
        msgs.filter((m) => m.id !== loadingId).concat({ id: Date.now().toString(), sender: "ai", text: aiText })
      );
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((msgs) =>
        msgs.filter((m) => m.id !== loadingId).concat({
          id: Date.now().toString(),
          sender: "ai",
          text: "⚠️ Error connecting to AI service.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 bg-secondary-600 text-white text-center font-bold text-xl flex items-center justify-center gap-2">
        🤖 AI Travel Assistant
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-xl ${
                msg.sender === "user"
                  ? "bg-secondary-600 text-white rounded-br-none"
                  : msg.sender === "loading"
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center justify-center rounded-bl-none"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
              }`}
            >
              {msg.sender === "loading" ? (
                <Loader2 className="animate-spin w-5 h-5 mx-auto" />
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
            placeholder="Ask about your travel safety..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 bg-secondary-600 text-white rounded-xl hover:bg-secondary-700 disabled:opacity-50 transition-colors flex items-center justify-center w-12 h-12"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
