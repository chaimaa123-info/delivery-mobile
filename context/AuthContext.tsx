
//context/AuthContext  
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void; 
  userName: string | null;
  setUserName: (name: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  userName: null,
  setUserName: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ token, setToken, userName, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
