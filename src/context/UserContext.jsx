import React, { createContext, useState, useContext, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: '',
    token: '',
    albergueId: ''
  });

  useEffect(() => {
    //Esto verifica si el token y otros datos existen en localStorage al cargar la página
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    const storedAlbergueId = localStorage.getItem('albergueId');

    if (storedToken && storedEmail && storedAlbergueId) {
      setUser({
        email: storedEmail,
        token: storedToken,
        albergueId: storedAlbergueId
      });
    }
  }, []);

  const updateUser = (newUserData) => {
    setUser(newUserData);

    // Guardar los datos en localStorage
    localStorage.setItem('token', newUserData.token);
    localStorage.setItem('email', newUserData.email);
    localStorage.setItem('albergueId', newUserData.albergueId);
  };

  const logout = () => {
    // Limpiar localStorage y estado del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('albergueId');
    setUser({
      email: '',
      token: '',
      albergueId: ''
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
