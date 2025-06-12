import { useState, useRef, useEffect, useContext } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import { FaPaperPlane } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

export default function CompanyMessages() {
  const { user } = useContext(UserContext);
  const emisorId = user?.albergue_id;
  const token = user?.token;

  const [chatList, setChatList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [messagesByUser, setMessagesByUser] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const selectedUserData = chatList.find(
    (chat) => `${chat.userType}-${chat.userId}` === selectedUser
  );

  const fetchChatList = async () => {
    try {
      const res = await fetch(`http://localhost:8000/mensajes/contactos?emisor_id=${emisorId}&emisor_tipo=albergue`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setChatList(data);
      return data; // <--- Esto permite el uso con .then()
    } catch (error) {
      console.error("Error al cargar contactos del chat:", error);
    }
  };
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!emisorId || !selectedUserData) return;

    try {
      const receptorId = selectedUserData.userId;
      const receptorTipo = selectedUserData.userType;

      const res = await fetch(
        `http://localhost:8000/mensajes/conversacion?id1=${emisorId}&tipo1=albergue&id2=${receptorId}&tipo2=${receptorTipo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Respuesta inesperada del backend:", data);
        return;
      }

      const formattedMessages = data.map((msg, index) => {
        const isFromCompany =
          msg.emisor_id === emisorId && msg.emisor_tipo === "albergue";

        return {
          id: index,
          text: msg.contenido,
          sender: isFromCompany ? "company" : "adopter",
          senderName: isFromCompany ? "Tú" : selectedUserData.name,
        };
      });

      setMessagesByUser((prev) => ({
        ...prev,
        [selectedUser]: formattedMessages,
      }));
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    }
  };

  
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", selectedUser);
    }
  }, [selectedUser]);

  
  useEffect(() => {
    if (emisorId && token) {
      const interval = setInterval(() => {
        fetchChatList();
      }, 10); // Actualiza cada 3 segundos
  
      return () => clearInterval(interval);
    }
  }, [emisorId, token]);
    
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesByUser, selectedUser]);

  const handleSend = async () => {
    if (!newMessage.trim() || !emisorId || !selectedUserData) return;

    const payload = {
      emisor_id: emisorId,
      emisor_tipo: "albergue",
      receptor_id: selectedUserData.userId,
      receptor_tipo: selectedUserData.userType,
      contenido: newMessage,
    };

    try {
      await fetch("http://localhost:8000/adoptante/mensajes/enviar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
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
          {chatList.map((chat) => (
            <div
              key={`${chat.userType}-${chat.userId}`}
              onClick={() => setSelectedUser(`${chat.userType}-${chat.userId}`)}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-orange-100 ${
                selectedUser === `${chat.userType}-${chat.userId}` ? "bg-orange-100" : ""
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
        {selectedUserData && (
          <>
            <div className="bg-white rounded-t-2xl shadow-sm">
              <div className="flex items-center gap-4 px-4 py-3">
                <img
                  src={selectedUserData.avatar}
                  alt={selectedUserData.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h3 className="text-lg font-semibold">{selectedUserData.name}</h3>
              </div>
              <div className="h-[1px] bg-[#ccccd4] w-full" />
            </div>

            <div className="flex flex-col bg-white rounded-b-2xl shadow-md flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
                {(messagesByUser[selectedUser] || []).map((msg) => (
                  <div key={msg.id}>
                    <div className={`flex ${msg.sender === "company" ? "justify-end" : "justify-start"}`}>
                      <div className="text-xs text-gray-500 mb-1">
                        {msg.senderName}
                      </div>
                    </div>

                    <div className={`flex ${msg.sender === "company" ? "justify-end" : "justify-start"}`}>
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
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

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
          </>
        )}
      </main>
    </div>
  );
}