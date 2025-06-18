import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext({
  name: null,
  email: null,
  token: null,
  user_id: null,
  imagen_perfil_id: null,
  setUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: null,
    email: null,
    token: null,
    user_id: null,
    imagen_perfil_id: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.token) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage:", error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
