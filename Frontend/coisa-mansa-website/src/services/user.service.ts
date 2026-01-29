/**
 * User Service
 * Serviço para gerenciar utilizadores
 */

import { api } from '@/utils/api';
import { User } from '@/types';

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: 'USER' | 'ADMIN' | 'OWNER';
}

class UserService {
  /**
   * Lista todos os utilizadores (apenas admins)
   */
  async getAll(): Promise<User[]> {
    return api.get<User[]>('/users');
  }

  /**
   * Obtém um utilizador por ID
   */
  async getById(id: number): Promise<User> {
    return api.get<User>(`/users/${id}`);
  }

  /**
   * Atualiza um utilizador
   */
  async update(id: number, data: UpdateUserData): Promise<User> {
    return api.put<User>(`/users/${id}`, data);
  }

  /**
   * Elimina um utilizador
   */
  async delete(id: number): Promise<void> {
    return api.delete(`/users/${id}`);
  }
}

export const userService = new UserService();
