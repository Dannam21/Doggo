import { useState, useRef, useEffect, useContext } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

export default function UserMessages() {
  const { user } = useContext(UserContext);
  const emisorId = user?.adoptante_id;
  const token = user?.token;

  const [chatList, setChatList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [messagesByUser, setMessagesByUser] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const websocketRef = useRef(null);

  const rolEmisor = "adoptante";
  const rolReceptor = selectedUserInfo?.userType || "";

  const fetchChatList = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/mensajes/contactos?emisor_id=${emisorId}&emisor_tipo=adoptante`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const enhancedChatList = await Promise.all(
        data.map(async (chat) => {
          const userInfo = await fetchUserAvatar(chat.userType, chat.userId);
          return { ...chat, name: userInfo.name, avatar: userInfo.avatar };
        })
      );
      setChatList(enhancedChatList);
    } catch (error) {
      console.error("Error al cargar contactos del chat:", error);
    }
  };

  const fetchUserAvatar = async (userType, userId) => {
    if (userType === "albergue") {
      try {
        const res = await fetch(`http://localhost:8000/albergue/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const albergue = await res.json();
        const imagenId = albergue.imagen_perfil_id;
        const avatarUrl = imagenId
          ? `http://localhost:8000/imagenesProfile/${imagenId}`
          : "https://via.placeholder.com/40";
        return { name: albergue.nombre, avatar: avatarUrl };
      } catch (error) {
        console.error("Error al obtener info del albergue:", error);
      }
    }
    return { name: "Usuario desconocido", avatar: "https://via.placeholder.com/40" };
  };

  const fetchMessages = async () => {
    if (!emisorId || !selectedUser) return;
    const [userType, userId] = selectedUser.split("-");
    try {
      const res = await fetch(
        `http://localhost:8000/mensajes/conversacion?id1=${emisorId}&tipo1=adoptante&id2=${userId}&tipo2=${userType}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const userInfo = await fetchUserAvatar(userType, userId);
      setSelectedUserInfo({ ...userInfo, userType, userId });

      const formattedMessages = data.map((msg, index) => ({
        id: `${msg.emisor_id}-${msg.contenido}-${index}`, // antes: id: index
        text: msg.contenido,
        sender: msg.emisor_id === emisorId && msg.emisor_tipo === "adoptante" ? "adopter" : "company",
        senderName: msg.emisor_id === emisorId ? "Tú" : userInfo.name,
      }));

      setMessagesByUser((prev) => ({
        ...prev,
        [selectedUser]: formattedMessages,
      }));
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    }
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(
        JSON.stringify({
          receptor_id: selectedUserInfo.userId,
          receptor_tipo: rolReceptor,
          contenido: newMessage,
        })
      );

      setMessagesByUser((prev) => ({
        ...prev,
        [selectedUser]: [
          ...(prev[selectedUser] || []),
          {
            id: `adopter-${newMessage}-${Date.now()}`, // clave única
            text: newMessage,
            sender: "adopter",
            senderName: "Tú",
          },
        ],
      }));

      setNewMessage("");
    } else {
      console.warn("⚠️ WebSocket no está abierto");
    }
  };

  const setupWebSocket = () => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${rolEmisor}/${emisorId}`);

    ws.onopen = () => {
      console.log("✅ WebSocket conectado");
      websocketRef.current = ws;
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const receptorKey = `${data.emisor_tipo}-${data.emisor_id}`;
      const newMsg = {
        id: `${data.emisor_id}-${data.contenido}-${Date.now()}`, // antes usabas length
        text: data.contenido,
        sender: "company",
        senderName: selectedUserInfo?.name || "Usuario",
      };

      setMessagesByUser((prev) => ({
        ...prev,
        [receptorKey]: [...(prev[receptorKey] || []), newMsg],
      }));
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error: ", error);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket cerrado");
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchChatList();
  }, [emisorId]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUserInfo && token && emisorId) {
      setupWebSocket();
    }
    return () => {
      websocketRef.current?.close();
    };
  }, [selectedUserInfo, token, emisorId]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesByUser, selectedUser]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      {/* Sidebar omitido o reemplazado */}

      <div className="w-72 bg-white flex flex-col shadow-md">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Chats</h2>
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
              <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover mr-3" />
              <div>
                <p className="font-semibold">{chat.name}</p>
                <p className="text-sm text-gray-500 truncate w-40">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat principal */}
      <main className="flex-1 p-6 flex flex-col">
        {selectedUserInfo && (
          <>
            <div className="bg-white rounded-t-2xl shadow-sm">
              <div className="flex items-center gap-4 px-4 py-3">
                <img
                  src={selectedUserInfo.avatar}
                  alt={selectedUserInfo.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h3 className="text-lg font-semibold">{selectedUserInfo.name}</h3>
              </div>
              <div className="h-[1px] bg-[#ccccd4] w-full" />
            </div>

            <div className="flex flex-col bg-white rounded-b-2xl shadow-md flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
                {(messagesByUser[selectedUser] || []).map((msg) => (
                  <div key={msg.id}>
                    <div className={`flex ${msg.sender === "adopter" ? "justify-end" : "justify-start"}`}>
                      <div className="text-xs text-gray-500 mb-1">{msg.senderName}</div>
                    </div>

                    <div className={`flex ${msg.sender === "adopter" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`px-5 py-3 max-w-[65%] text-sm rounded-2xl whitespace-pre-wrap break-words shadow-sm ${
                          msg.sender === "adopter"
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
