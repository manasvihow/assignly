import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import apiClient from '../api/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser({
        username: decodedToken.sub,
        role: decodedToken.role,
      });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiClient.post('/auth/token', formData);
    
    const { access_token } = response.data;
    localStorage.setItem('accessToken', access_token);
    setToken(access_token);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};