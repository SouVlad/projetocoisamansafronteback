/**
 * Custom Hook para gerenciar eventos
 * Exemplo de uso dos serviços em componentes React
 */

import { useState, useEffect } from 'react';
import { eventsService, Event } from '@/services/events.service';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega eventos ao montar o componente
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getUpcoming();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar eventos');
      console.error('Erro ao carregar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: any) => {
    try {
      const newEvent = await eventsService.create(eventData);
      setEvents(prev => [...prev, newEvent]);
      return { success: true, data: newEvent };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateEvent = async (id: string, eventData: any) => {
    try {
      const updatedEvent = await eventsService.update(id, eventData);
      setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
      return { success: true, data: updatedEvent };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await eventsService.delete(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    events,
    loading,
    error,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
