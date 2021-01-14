import React, { createContext, useCallback, useState, useContext } from 'react';

import api from '../services/api';
import { formattingCPF, formattingPhone } from '../utils/masks';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
}
interface AuthState {
  token: string;
  user: User;
}
interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');
    if (token && user) {
      let userLocalStorage: User;
      userLocalStorage = JSON.parse(user);
      userLocalStorage = {
        ...userLocalStorage,
        phone: formattingPhone(userLocalStorage.phone),
        cpf: formattingCPF(userLocalStorage.cpf),
      };
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: userLocalStorage };
    }
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });
    const { token, user } = response.data;
    let userLocalStorage: User;
    userLocalStorage = user;
    userLocalStorage = {
      ...userLocalStorage,
      phone: formattingPhone(userLocalStorage.phone),
      cpf: formattingCPF(userLocalStorage.cpf),
    };
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(userLocalStorage));
    api.defaults.headers.authorization = `Bearer ${token}`;
    setData({ token, user: userLocalStorage });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));
      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
