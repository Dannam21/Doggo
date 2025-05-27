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

  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />

      <main className="flex-1 p-8 flex flex-col">
        <h1 className="text-3xl font-bold text-[#2e2e2e] mb-6">💬 Conversación con adoptador</h1>

        <div className="flex flex-col flex-1 bg-white rounded-xl shadow-md p-6 overflow-hidden">
    
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-sm px-4 py-2 rounded-lg ${
                  msg.sender === "company"
                    ? "bg-orange-100 text-right self-end"
                    : "bg-gray-100 self-start"
                }`}
              >
                <p className="text-sm text-gray-800">{msg.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              onClick={handleSend}
              className="bg-[#f77534] text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition font-semibold"
            >
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
