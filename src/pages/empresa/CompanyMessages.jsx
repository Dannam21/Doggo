// CompanyMessages.jsx

import { useState, useRef, useEffect, useContext } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import { FaPaperPlane } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

export default function CompanyMessages() {
  const { user } = useContext(UserContext);
  const emisorId = user?.albergue_id;
  const token = user?.token;

  const [chatList, setChatList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(() => localStorage.getItem("lastSelectedChat") || "");
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [messagesByUser, setMessagesByUser] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [estadoMascota, setEstadoMascota] = useState("");
  const messagesEndRef = useRef(null);
  const websocketRef = useRef(null);

  const rolEmisor = "albergue";
  const rolReceptor = selectedUserInfo?.userType || "";

  useEffect(() => {
    if (selectedUser) localStorage.setItem("lastSelectedChat", selectedUser);
  }, [selectedUser]);

  const fetchChatList = async () => {
    try {
      const res = await fetch(
        `http://34.195.195.173:8000/mensajes3/contactos?emisor_id=${emisorId}&emisor_tipo=albergue`,
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

      setChatList(Object.values(grouped));
    } catch (error) {
      console.error("Error al cargar contactos del chat:", error);
    }
  };

  const fetchUserAvatar = async (userType, userId) => {
    try {
      const url = userType === "adoptante"
        ? `http://34.195.195.173:8000/adoptante/${userId}`
        : `http://34.195.195.173:8000/albergue/${userId}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const user = await res.json();
      const avatarUrl = user.imagen_perfil_id
        ? `http://34.195.195.173:8000/imagenesProfile/${user.imagen_perfil_id}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre)}`;
      return { name: user.nombre, avatar: avatarUrl };
    } catch {
      return { name: "Usuario desconocido", avatar: "https://ui-avatars.com/api/?name=Usuario" };
    }
  };

  const fetchMessages = async () => {
    if (!emisorId || !selectedUser) return;
    const [userType, userId, mascotaIdStr] = selectedUser.split("-");
    const mascotaId = parseInt(mascotaIdStr);
    if (isNaN(mascotaId)) return;

    try {
      const url = `http://34.195.195.173:8000/mensajes3/conversacion?id1=${emisorId}&tipo1=albergue&id2=${userId}&tipo2=${userType}&mascota_id=${mascotaId}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const userInfo = await fetchUserAvatar(userType, userId);
      setSelectedUserInfo({ ...userInfo, userType, userId });

      const formattedMessages = data.map((msg, index) => ({
        id: `${msg.emisor_id}-${msg.contenido}-${index}`,
        text: msg.contenido,
        sender: msg.emisor_id === emisorId && msg.emisor_tipo === "albergue" ? "company" : "adopter",
        senderName: userInfo.name,
      }));

      setMessagesByUser((prev) => ({ ...prev, [selectedUser]: formattedMessages }));

      // Obtener estado de la mascota
      const mascotaRes = await fetch(`http://34.195.195.173:8000/usuario/mascotas/${mascotaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (mascotaRes.ok) {
        const mascotaData = await mascotaRes.json();
        setEstadoMascota(mascotaData.estado || "");
      }
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const [userType, userId, mascotaId] = selectedUser.split("-");

    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({
        receptor_id: selectedUserInfo.userId,
        receptor_tipo: rolReceptor,
        contenido: newMessage,
        mascota_id: mascotaId,
      }));

      setMessagesByUser((prev) => ({
        ...prev,
        [selectedUser]: [
          ...(prev[selectedUser] || []),
          {
            id: `company-${newMessage}-${Date.now()}`,
            text: newMessage,
            sender: "company",
            senderName: selectedUserInfo.name,
          },
        ],
      }));
      setNewMessage("");
    }
  };

  const setupWebSocket = () => {
    const ws = new WebSocket(`ws://34.195.195.173:8000/ws/chat/${rolEmisor}/${emisorId}`);
    ws.onopen = () => (websocketRef.current = ws);
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
            sender: data.emisor_tipo === "albergue" ? "company" : "adopter",
            senderName: userInfo.name,
          },
        ],
      }));
    };
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket cerrado");
  };

  useEffect(() => { fetchChatList(); }, [emisorId]);
  useEffect(() => { if (selectedUser?.split("-").length === 3) fetchMessages(); }, [selectedUser]);
  useEffect(() => { if (token && emisorId) setupWebSocket(); return () => websocketRef.current?.close(); }, [token, emisorId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messagesByUser, selectedUser]);

  const handleCompletarAdopcion = async () => {
    const [userType, adoptanteId, mascotaIdStr] = selectedUser.split("-");
    const mascotaId = parseInt(mascotaIdStr);
    try {
      const matchRes = await fetch(`http://34.195.195.173:8000/matches/${adoptanteId}/${mascotaId}/complete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!matchRes.ok) throw new Error("Error al confirmar la adopción");

      const patchRes = await fetch(`http://34.195.195.173:8000/mascotas/${mascotaId}/adoptar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!patchRes.ok) throw new Error("Error al marcar como adoptado");

      alert("✅ Adopción confirmada y mascota marcada como adoptada.");
      setEstadoMascota("Adoptado");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdf0df] ml-64">
      <SidebarCompany />
      {/* Chat List Sidebar */}
      <div className="w-72 bg-white flex flex-col shadow-md">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Mensajes</h2>
          <FaPaperPlane className="text-gray-600" />
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-5rem)]">
          {chatList.map((group) => (
            <div key={`${group.userType}-${group.userId}`} className="border-b border-gray-200">
              <div className="flex items-center px-4 py-3 bg-orange-50 font-bold text-sm text-orange-600">
                <img src={group.avatar} alt={group.name} className="w-8 h-8 rounded-full object-cover mr-2" />
                {group.name}
              </div>
              {group.chats.map((chat) => {
                const chatKey = `${group.userType}-${group.userId}-${chat.mascota_id}`;
                return (
                  <div key={chatKey} onClick={() => setSelectedUser(chatKey)}
                    className={`flex items-center pl-12 pr-4 py-3 cursor-pointer hover:bg-orange-100 ${selectedUser === chatKey ? "bg-orange-100" : ""}`}>
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm text-gray-800">Mascota ID: {chat.mascota_id}</p>
                      <p className="text-xs text-gray-500 truncate w-40">{chat.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
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

                {estadoMascota !== "Adoptado" ? (
                  <button
                    onClick={handleCompletarAdopcion}
                    className="ml-auto bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded font-semibold transition"
                  >
                    Confirmar adopción
                  </button>
                ) : (
                  <div className="ml-auto bg-green-100 text-green-700 text-sm px-4 py-2 rounded font-semibold border border-green-300">
                    ✅ ¡Adopción exitosa!
                  </div>
                )}
              </div>
              <div className="h-[1px] bg-[#ccccd4] w-full" />
            </div>

            <div className="flex flex-col bg-white rounded-b-2xl shadow-md flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
                {(messagesByUser[selectedUser] || []).map((msg) => {
                  let content;
                  try {
                    const parsed = JSON.parse(msg.text);
                    if (parsed.tipo === "card_perro") {
                      content = (
                        <div className="w-64 rounded-xl overflow-hidden shadow-lg bg-white border border-orange-300">
                          <img src={parsed.imagen} alt={parsed.nombre} className="w-full h-40 object-cover" />
                          <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-800">{parsed.nombre}</h3>
                            <p className="text-sm text-gray-600">{parsed.descripcion}</p>
                          </div>
                        </div>
                      );
                    }
                  } catch {
                    content = (
                      <div
                        className={`inline-block px-4 py-3 rounded-2xl text-sm shadow-md whitespace-pre-wrap break-words transition-transform duration-150 hover:scale-[1.01] ${
                          msg.sender === "company"
                            ? "bg-[#f77534] text-white rounded-br-none self-end"
                            : "bg-gray-100 text-gray-800 rounded-bl-none self-start"
                        }`}
                      >
                        {msg.text}
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex ${msg.sender === "company" ? "justify-end" : "justify-start"}`}>
                      <div className="flex flex-col max-w-[70%]">
                        <div
                          className={`text-xs mb-1 ${
                            msg.sender === "company" ? "text-right text-orange-500" : "text-left text-gray-600"
                          }`}
                        >
                          {msg.sender === "company" ? "Tú" : msg.senderName}
                        </div>
                        {content}
                      </div>
                    </div>
                  );
                })}
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
