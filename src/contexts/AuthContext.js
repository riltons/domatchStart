import { createContext, useContext, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    console.log('Tentando fazer login com:', { email, password });
    if (!email || !password) {
      console.error('Email ou senha não fornecidos');
      return { user: null, error: { message: 'Email ou senha não fornecidos' } };
    }
    
    try {
      console.log('Dados enviados para autenticação:', { email, password });
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      console.log('Resposta do Supabase:', { data, error });
      
      if (error) {
        console.error('Erro ao fazer login:', error.message);
        return { user: null, error };
      }
      
      if (data?.user) {
        setUser(data.user);
        console.log('Usuário autenticado:', data.user);
        return { user: data.user, error: null };
      } else {
        console.error('Usuário não encontrado');
        return { user: null, error: { message: 'Usuário não encontrado' } };
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { user: null, error };
    }
  };

  const register = async (userData) => {
    console.log('Tentando registrar usuário com:', userData);
    const { email, password } = userData;
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: userData.name
          }
        }
      });
      
      if (error) {
        console.error('Erro ao registrar:', error.message);
        return { user: null, error };
      }
      
      if (data?.user) {
        setUser(data.user);
        return { user: data.user, error: null };
      } else {
        return { user: null, error: { message: 'Erro ao criar usuário' } };
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { user: null, error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  // Teste de registro de um novo usuário
  const testRegister = async () => {
    const testUser = { email: 'uniqueuser@example.com', password: '123456' }; // Novo usuário para teste
    const { user, error } = await supabase.auth.signUp(testUser);
    console.log('Teste de registro:', { user, error });
    if (error) {
      console.error('Erro ao registrar no teste:', error.message); // Log detalhado do erro
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, testRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
