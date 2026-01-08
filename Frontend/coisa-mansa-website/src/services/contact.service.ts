/**
 * Contact Service
 * Serviço para gerenciar mensagens de contato
 */

import { api } from '@/utils/api';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactMessageData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

class ContactService {
  /**
   * Envia uma nova mensagem de contato
   */
  async send(data: CreateContactMessageData): Promise<void> {
    return api.post('/contact', data);
  }

  /**
   * Lista todas as mensagens (admin)
   */
  async getAll(): Promise<ContactMessage[]> {
    return api.get<ContactMessage[]>('/contact');
  }

  /**
   * Busca uma mensagem específica por ID (admin)
   */
  async getById(id: string): Promise<ContactMessage> {
    return api.get<ContactMessage>(`/contact/${id}`);
  }

  /**
   * Marca mensagem como lida (admin)
   */
  async markAsRead(id: string): Promise<ContactMessage> {
    return api.patch<ContactMessage>(`/contact/${id}/read`, {});
  }

  /**
   * Remove uma mensagem (admin)
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/contact/${id}`);
  }
}

export const contactService = new ContactService();
