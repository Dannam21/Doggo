import { createContext, useState } from "react";

export const UserContext = createContext({
  name: null,
  email: null,
  token: null,
  albergue_id: null,
  setUser: () => {}
});

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: null,
    email: null,
    token: null,
    albergue_id: null,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}