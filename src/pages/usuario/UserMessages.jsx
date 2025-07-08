import { useState, useRef, useEffect, useContext } from "react";
import { FaPaperPlane, FaTimes, FaBars } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import SidebarUser from "../../components/SidebarUser";

export default function UserMessages() {
  const { user } = useContext(UserContext);
  const emisorId = user?.adoptante_id;
  const token = user?.token;

  const [chatList, setChatList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [messagesByUser, setMessagesByUser] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const websocketRef = useRef(null);

  const rolEmisor = "adoptante";
  const rolReceptor = selectedUserInfo?.userType || "";

  // Guardar el último chat seleccionado
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("lastUserChat", selectedUser);
    }
  }, [selectedUser]);

  const fetchChatList = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/mensajes3/contactos?emisor_id=${emisorId}&emisor_tipo=adoptante`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
  
      const grouped = {};
  
      for (const chat of data) {
        const key = `${chat.userType}-${chat.userId}`;
        const userInfo = await fetchUserAvatar(chat.userType, chat.userId);
  
        if (!grouped[key]) {
          grouped[key] = {
            name: userInfo.name,
            avatar: userInfo.avatar,
            userType: chat.userType,
            userId: chat.userId,
            chats: [],
          };
        }
  
        grouped[key].chats.push({
          mascota_id: chat.mascota_id,
          lastMessage: chat.lastMessage,
        });
      }
  
      const fetchedChats = Object.values(grouped);
      setChatList(fetchedChats);
  
      // Obtener última selección si existe y es válida
      const lastChat = localStorage.getItem("lastUserChat");
  
      const chatExists = fetchedChats.some(group =>
        group.chats.some(chat =>
          `${group.userType}-${group.userId}-${chat.mascota_id}` === lastChat
        )
      );
  
      if (fetchedChats.length === 0) {
        setSelectedUser("");
        localStorage.removeItem("lastUserChat");
      } else if (chatExists) {
        setSelectedUser(lastChat);
      } else {
        const firstGroup = fetchedChats[0];
        const firstChat = firstGroup.chats[0];
        const firstChatKey = `${firstGroup.userType}-${firstGroup.userId}-${firstChat.mascota_id}`;
        setSelectedUser(firstChatKey);
      }
    } catch (error) {
      console.error("Error al cargar contactos del chat:", error);
    }
  };

  const fetchUserAvatar = async (userType, userId) => {
    try {
      let url = "";
      if (userType === "adoptante") {
        url = `http://localhost:8000/adoptante/${userId}`;
      } else if (userType === "albergue") {
        url = `http://localhost:8000/albergue/${userId}`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Usuario no encontrado");
      const user = await res.json();
      const imagenId = user.imagen_perfil_id;
      const avatarUrl = imagenId
        ? `http://localhost:8000/imagenesProfile/${imagenId}`
        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.nombre);
      return { name: user.nombre, avatar: avatarUrl };
    } catch (error) {
      console.error("Error al obtener info del usuario:", error.message);
      return { name: "Usuario desconocido", avatar: "https://ui-avatars.com/api/?name=Usuario" };
    }
  };

  const fetchMessages = async () => {
    if (!emisorId || !selectedUser) return;
    const [userType, userId, mascotaIdStr] = selectedUser.split("-");
    const mascotaId = parseInt(mascotaIdStr);

    if (isNaN(mascotaId)) {
      console.error("❌ mascota_id inválido para el chat seleccionado");
      return;
    }

    try {
      const url = `http://localhost:8000/mensajes3/conversacion?id1=${emisorId}&tipo1=adoptante&id2=${userId}&tipo2=${userType}&mascota_id=${mascotaId}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error("Respuesta no válida: " + errText);
      }

      const data = await res.json();
      const userInfo = await fetchUserAvatar(userType, userId);
      setSelectedUserInfo({ ...userInfo, userType, userId });

      const formattedMessages = data.map((msg, index) => ({
        id: `${msg.emisor_id}-${msg.contenido}-${index}`,
        text: msg.contenido,
        sender: msg.emisor_id === emisorId && msg.emisor_tipo === "adoptante" ? "adopter" : "company",
        senderName: userInfo.name,
      }));

      setMessagesByUser((prev) => ({
        ...prev,
        [selectedUser]: formattedMessages,
      }));
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const [userType, userId, mascotaId] = selectedUser.split("-");

    if (!selectedUserInfo?.name || !selectedUserInfo?.avatar) {
      const userInfo = await fetchUserAvatar(userType, userId);
      setSelectedUserInfo({ ...userInfo, userType, userId });
    }

    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(
        JSON.stringify({
          receptor_id: selectedUserInfo.userId,
          receptor_tipo: rolReceptor,
          contenido: newMessage,
          mascota_id: mascotaId,
        })
      );

      setMessagesByUser((prev) => ({
        ...prev,
        [selectedUser]: [
          ...(prev[selectedUser] || []),
          {
            id: `adopter-${newMessage}-${Date.now()}`,
            text: newMessage,
            sender: "adopter",
            senderName: selectedUserInfo.name,
          },
        ],
      }));

      setNewMessage("");
      // Resetear altura del textarea después de enviar
      setTimeout(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.style.height = '48px';
        }
      }, 0);
    } else {
      console.warn("WebSocket no está abierto");
    }
  };

  const setupWebSocket = () => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${rolEmisor}/${emisorId}`);

    ws.onopen = () => {
      console.log("✅ WebSocket conectado");
      websocketRef.current = ws;
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      const receptorKey = `${data.emisor_tipo}-${data.emisor_id}-${data.mascota_id}`;
      const userInfo = await fetchUserAvatar(data.emisor_tipo, data.emisor_id);

      setMessagesByUser((prev) => ({
        ...prev,
        [receptorKey]: [
          ...(prev[receptorKey] || []),
          {
            id: `${data.emisor_id}-${data.contenido}-${Date.now()}`,
            text: data.contenido,
            sender: data.emisor_tipo === "adoptante" ? "adopter" : "company",
            senderName: userInfo.name,
          },
        ],
      }));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    ws.onclose = () => {
      console.log("WebSocket cerrado");
    };
  };

  useEffect(() => {
    fetchChatList();
  }, [emisorId]);

  useEffect(() => {
    if (selectedUser && selectedUser.split("-").length === 3) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (token && emisorId) {
      setupWebSocket();
    }
    return () => {
      websocketRef.current?.close();
    };
  }, [token, emisorId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByUser, selectedUser]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 120; // máximo ~5 líneas
    const newHeight = Math.min(scrollHeight, maxHeight);
    textarea.style.height = newHeight + 'px';
  };

  const handleTextareaChange = (e) => {
    setNewMessage(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const handleChatSelect = (chatKey) => {
    setSelectedUser(chatKey);
    setIsChatListOpen(false); // Cerrar sidebar en móvil después de seleccionar
  };

  return (
    <div className="flex min-h-screen bg-[#fdf0df] lg:ml-64">
      {/* Sidebar principal - Solo visible en desktop */}
      <div className="hidden lg:block">
        <SidebarUser />
      </div>

      {/* Overlay para móvil */}
      {isChatListOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsChatListOpen(false)}
        />
      )}

      {/* Mobile/Tablet Sidebar with Navigation and Chats */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full w-80 sm:w-72 bg-white flex flex-col shadow-md z-50 transform transition-transform duration-300 ease-in-out
        ${isChatListOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:w-72
      `}>
        {/* Header del sidebar móvil */}
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold lg:hidden">Navegación</h2>
          <h2 className="text-lg sm:text-xl font-bold hidden lg:block">Mensajes</h2>
          <div className="flex items-center gap-2">
            <FaPaperPlane className="text-gray-600 hidden lg:block" />
            <button
              onClick={() => setIsChatListOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navegación principal - Solo visible en móvil/tablet */}
        <div className="lg:hidden border-b border-gray-200">
          <SidebarUser />
        </div>

        {/* Sección de mensajes */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header de mensajes para móvil */}
          <div className="lg:hidden px-4 py-3 bg-orange-50 border-b border-gray-200">
            <h3 className="font-bold text-sm text-orange-600 flex items-center">
              <FaPaperPlane className="mr-2" />
              Mensajes
            </h3>
          </div>

          {/* Lista de chats */}
          <div className="overflow-y-auto flex-1">
            {chatList.map((group) => (
              <div key={`${group.userType}-${group.userId}`} className="border-b border-gray-200">
                <div className="flex items-center px-4 py-3 bg-orange-50 font-bold text-sm text-orange-600">
                  <img src={group.avatar} alt={group.name} className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0" />
                  <span className="truncate">{group.name}</span>
                </div>

                {group.chats.map((chat) => {
                  const chatKey = `${group.userType}-${group.userId}-${chat.mascota_id}`;
                  return (
                    <div
                      key={chatKey}
                      onClick={() => handleChatSelect(chatKey)}
                      className={`flex items-center pl-8 sm:pl-12 pr-4 py-3 cursor-pointer hover:bg-orange-100 ${selectedUser === chatKey ? "bg-orange-100" : ""}`}
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="font-semibold text-sm text-gray-800">Mascota ID: {chat.mascota_id}</p>
                        <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-0 h-screen">
        {selectedUserInfo ? (
          <>
            {/* Header del chat - FIJO */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
              <div className="flex items-center gap-3 sm:gap-4 px-4 py-3">
                {/* Botón hamburguesa para móvil */}
                <button
                  onClick={() => setIsChatListOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                  title="Abrir navegación y mensajes"
                >
                  <FaBars className="text-gray-600" />
                </button>

                <img
                  src={selectedUserInfo.avatar}
                  alt={selectedUserInfo.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
                <h3 className="text-base sm:text-lg font-semibold truncate flex-1 min-w-0">{selectedUserInfo.name}</h3>
              </div>
            </div>

            {/* Área de mensajes - SCROLLABLE */}
            <div className="flex-1 flex flex-col bg-white min-h-0">
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-3">
                {(messagesByUser[selectedUser] || []).map((msg) => {
                  let content;
                  try {
                    const parsed = JSON.parse(msg.text);
                    if (parsed.tipo === "card_perro") {
                      content = (
                        <div className="w-full max-w-64 rounded-xl overflow-hidden shadow-lg bg-white border border-orange-300">
                          <img src={parsed.imagen} alt={parsed.nombre} className="w-full h-32 sm:h-40 object-cover" />
                          <div className="p-3 sm:p-4">
                            <h3 className="text-base sm:text-lg font-bold text-gray-800">{parsed.nombre}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{parsed.descripcion}</p>
                          </div>
                        </div>
                      );
                    }
                  } catch (e) {
                    content = (
                      <div
                        className={`inline-block px-3 sm:px-4 py-2 sm:py-3 rounded-2xl text-sm shadow-md whitespace-pre-wrap break-words transition-transform duration-150 hover:scale-[1.01] max-w-full ${
                          msg.sender === "adopter"
                            ? "bg-[#f77534] text-white rounded-br-none self-end"
                            : "bg-gray-100 text-gray-800 rounded-bl-none self-start"
                        }`}
                      >
                        {msg.text}
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex ${msg.sender === "adopter" ? "justify-end" : "justify-start"}`}>
                      <div className="flex flex-col max-w-[85%] sm:max-w-[70%]">
                        <div
                          className={`text-xs mb-1 ${
                            msg.sender === "adopter" ? "text-right text-orange-500" : "text-left text-gray-600"
                          }`}
                        >
                          {msg.sender === "adopter" ? "Tú" : msg.senderName}
                        </div>
                        {content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input de mensaje - FIJO */}
              <div className="px-4 py-3 bg-white border-t border-gray-200 sticky bottom-0">
                <div className="flex items-end gap-2 max-w-4xl mx-auto">
                  <textarea
                    value={newMessage}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 resize-none p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 min-h-12 max-h-30 text-sm overflow-y-auto"
                    rows="1"
                    style={{ height: '48px' }} // altura inicial
                  />
                  <button
                    onClick={handleSend}
                    className="bg-[#f77534] text-white px-4 sm:px-5 py-3 rounded-lg hover:bg-orange-500 transition font-semibold text-sm whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Enviar</span>
                    <FaPaperPlane className="sm:hidden" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Estado vacío cuando no hay chat seleccionado
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center px-4">
              <button
                onClick={() => setIsChatListOpen(true)}
                className="lg:hidden mb-4 bg-[#f77534] text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition font-semibold"
              >
                Abrir navegación
              </button>
              <div className="text-gray-500">
                <FaPaperPlane className="mx-auto text-4xl mb-4 text-gray-300" />
                <p className="text-lg font-medium">Selecciona una conversación</p>
                <p className="text-sm mt-2">Elige un chat de la lista para comenzar a conversar</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}