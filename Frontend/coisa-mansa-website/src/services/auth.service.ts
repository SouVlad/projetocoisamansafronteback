/**
 * Auth Service
 * Serviço responsável por todas as operações de autenticação
 */

import { api } from '@/utils/api';
import { User } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

class AuthService {
  /**
   * Realiza login no sistema
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Salva token e usuário no localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  /**
   * Realiza logout do sistema
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
    } finally {
      // Remove dados do localStorage independente do resultado
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Registra novo usuário
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    
    // Salva token e usuário no localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  /**
   * Verifica se o token atual é válido
   */
  async verifyToken(): Promise<User> {
    const user = await api.get<User>('/auth/me');
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  /**
   * Solicita reset de senha
   */
  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  /**
   * Reseta a senha com token
   */
  async resetPassword(token: string, password: string, passwordConfirmation: string): Promise<void> {
    await api.post('/auth/reset-password', {
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
  }

  /**
   * Atualiza perfil do usuário
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const user = await api.put<User>('/auth/profile', data);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  /**
   * Altera senha do usuário autenticado
   */
  async changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<void> {
    await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    });
  }
}

export const authService = new AuthService();
