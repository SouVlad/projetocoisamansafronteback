/**
 * Events Service
 * Serviço para gerenciar eventos/agenda
 */

import { api } from '@/utils/api';
import { Event } from '@/types';

export interface CreateEventData {
  title: string;
  description?: string;
  location?: string;
  startsAt: string; // ISO 8601 format
  endsAt?: string;  // ISO 8601 format
  isPublic?: boolean;
}

class EventsService {
  /**
   * Lista todos os eventos (públicos para users, todos para admin)
   */
  async getAll(): Promise<Event[]> {
    return api.get<Event[]>('/events');
  }

  /**
   * Lista apenas eventos futuros e públicos
   */
  async getUpcoming(): Promise<Event[]> {
    const events = await this.getAll();
    const now = new Date();
    return events.filter(event => 
      new Date(event.startsAt) > now && event.isPublic
    );
  }

  /**
   * Busca um evento específico por ID
   */
  async getById(id: number): Promise<Event> {
    return api.get<Event>(`/events/${id}`);
  }

  /**
   * Cria um novo evento (admin apenas)
   */
  async create(data: CreateEventData): Promise<Event> {
    return api.post<Event>('/events', data);
  }

  /**
   * Atualiza um evento existente (admin apenas)
   */
  async update(id: number, data: Partial<CreateEventData>): Promise<Event> {
    return api.put<Event>(`/events/${id}`, data);
  }

  /**
   * Remove um evento (admin apenas)
   */
  async delete(id: number): Promise<void> {
    return api.delete(`/events/${id}`);
  }

  /**
   * Envia lembrete de evento para o utilizador autenticado
   */
  async sendReminder(id: number): Promise<{ message: string; event: string; sentTo: string }> {
    return api.post(`/events/${id}/reminder`);
  }
}

export const eventsService = new EventsService();
