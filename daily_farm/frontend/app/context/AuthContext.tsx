'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import * as api from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 페이지 로드 시 사용자 정보 확인
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.getCurrentUser();
          setUser(response);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await api.login({ username: email, password });
      const userResponse = await api.getCurrentUser();
      setUser(userResponse);
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      localStorage.removeItem('token');
      setUser(null);
    } catch (err: any) {
      setError(err.message || '로그아웃에 실패했습니다.');
      throw err;
    }
  };

  const register = async (userData: any) => {
    try {
      setError(null);
      await api.register(userData);
      await login(userData.email, userData.password);
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 