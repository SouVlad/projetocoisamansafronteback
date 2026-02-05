import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from '@/types';
import { authService } from '@/services/auth.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on app start
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Restaura o usuário imediatamente do localStorage
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser?.user ?? parsedUser);
          } catch (e) {
            console.error('Erro ao parsear usuário do localStorage:', e);
          }
          
          // Verifica token com o backend em background
          try {
            const user = await authService.verifyToken();
            setUser(user); // Atualiza com dados frescos do servidor
          } catch (error: any) {
            console.error('Erro ao verificar token:', error);
            // Só limpa se for erro de autenticação (401, 403), não erro de conexão
            if (error?.status === 401 || error?.status === 403) {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user');
              setUser(null);
            }
            // Se for erro de conexão (status 0), mantém o usuário logado localmente
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.register({ username, email, password });
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN' || user?.role === 'OWNER' || user?.superAdmin === true,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};