import { useState, useRef, useEffect } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import { FaPaperPlane } from "react-icons/fa";

export default function CompanyMessages() {
  const chatList = [
    {
      id: "user1",
      name: "Sofía",
      avatar: "https://i.pravatar.cc/150?img=1",
      lastMessage: "¿Puedo ver a Luna?",
    },
    {
      id: "user2",
      name: "Carlos",
      avatar: "https://i.pravatar.cc/150?img=2",
      lastMessage: "Estoy interesado en Bruno",
    },
    {
      id: "user3",
      name: "Ana",
      avatar: "https://i.pravatar.cc/150?img=3",
      lastMessage: "¿Hay cachorros?",
    },
    
  ];

  const initialMessages = {
    user1: [
      {
        id: 1,
        text: "Hola, estoy interesada en adoptar a Luna 🐶",
        sender: "adopter",
      },
      {
        id: 2,
        text: "¡Hola! Qué alegría 🧡 ¿Deseas agendar una visita?",
        sender: "company",
      },
    ],
    user2: [{ id: 1, text: "Hola, me interesa Bruno", sender: "adopter" }],
    user3: [
      {
        id: 1,
        text: "Hola, ¿tienen cachorros disponibles?",
        sender: "adopter",
      },
    ],
    
    
  };

  const [selectedUser, setSelectedUser] = useState("user1");
  const [messagesByUser, setMessagesByUser] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const selectedUserData = chatList.find((chat) => chat.id === selectedUser);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesByUser, selectedUser]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const updatedMessages = {
      ...messagesByUser,
      [selectedUser]: [
        ...messagesByUser[selectedUser],
        { id: Date.now(), text: newMessage, sender: "company" },
      ],
    };
    setMessagesByUser(updatedMessages);
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

      {/* Lista de chats */}
<div className="w-72 bg-white flex flex-col shadow-md">
  <div className="px-6 py-4 flex items-center justify-between">
    <h2 className="text-xl font-bold">Mensajes</h2>
    <FaPaperPlane className="text-gray-600" />
  </div>

  <div className="overflow-y-auto max-h-[calc(100vh-5rem)]">
    {chatList.map((chat, index) => (
      <div
        key={index}
        onClick={() => setSelectedUser(chat.id)}
        className={`flex items-center px-4 py-3 cursor-pointer hover:bg-orange-100 ${
          selectedUser === chat.id ? "bg-orange-100" : ""
        }`}
      >
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <p className="font-semibold">{chat.name}</p>
          <p className="text-sm text-gray-500 truncate w-40">
            {chat.lastMessage}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>


      {/* Vista de conversación */}
      <main className="flex-1 p-6 flex flex-col">
        {/* Encabezado tipo IG */}
        <div className="bg-white rounded-t-2xl shadow-sm">
          <div className="flex items-center gap-4 px-4 py-3">
            <img
              src={selectedUserData.avatar}
              alt={selectedUserData.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <h3 className="text-lg font-semibold">{selectedUserData.name}</h3>
          </div>
          {/* Línea divisoria suave */}
          <div className="h-[1px] bg-[#ccccd4] w-full" />
        </div>

        <div className="flex flex-col bg-white rounded-b-2xl shadow-md flex-1 overflow-hidden">
          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
            {(messagesByUser[selectedUser] || []).map((msg) => (
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
          <div className="px-4 py-3 bg-white flex items-center gap-2">
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
