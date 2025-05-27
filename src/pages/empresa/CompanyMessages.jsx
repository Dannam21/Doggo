import { useState, useRef, useEffect } from "react";
import SidebarCompany from "../../components/SidebarCompany";

export default function CompanyMessages() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hola, estoy interesada en adoptar a Luna 🐶", sender: "adopter" },
    { id: 2, text: "¡Hola! Qué alegría 🧡 ¿Deseas agendar una visita?", sender: "company" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: "company" }]);
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />

      <main className="flex-1 p-6 flex flex-col">
        <div className="flex flex-col bg-white rounded-2xl shadow-md flex-1 overflow-hidden">
          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "company" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-5 py-3 max-w-[65%] text-sm rounded-2xl whitespace-pre-wrap break-words shadow-sm ${
                    msg.sender === "company"
                      ? "bg-orange-200 text-right rounded-br-none"
                      : "bg-gray-200 text-left rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input abajo */}
          <div className="border-t px-4 py-3 bg-white flex items-center gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              className="flex-1 resize-none p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 h-12"
            />
            <button
              onClick={handleSend}
              className="bg-[#f77534] text-white px-5 py-2 rounded-lg hover:bg-orange-500 transition font-semibold"
            >
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
