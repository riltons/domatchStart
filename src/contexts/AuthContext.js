import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient'; // Importar o cliente Supabase

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (userData) => {
    const { user, error } = await supabase.auth.signIn({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      console.error('Erro ao fazer login:', error.message);
      return false;
    }

    setUser(user);
    return true;
  };

  const register = async (userData) => {
    const { user, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      console.error('Erro ao registrar:', error.message);
      return false;
    }

    setUser(user);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
