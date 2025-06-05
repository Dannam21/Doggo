import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("myapp_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserState(parsed);
      } catch {
        localStorage.removeItem("myapp_user");
      }
    }
  }, []);

  const setUser = (userData) => {
    setUserState(userData);
    localStorage.setItem("myapp_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem("myapp_user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
