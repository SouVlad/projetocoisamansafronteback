import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Ticket, Mail, ExternalLink, Plus, Edit, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import { format, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { eventsService } from '@/services/events.service';

export const AgendaPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startsAt: '',
    isPublic: true
  });
  
  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await eventsService.getAll();
        setEvents(data);
      } catch (err) {
        console.error('Erro ao carregar eventos:', err);
        setError('Erro ao carregar eventos. Tenta novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);
  
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const filteredEvents = events.filter(event => {
    
    if (!isAdmin && !event.isPublic) return false;
    
    const eventDate = startOfDay(new Date(event.startsAt));
    const today = startOfDay(new Date());
    
    switch (filter) {
      case 'upcoming':
        return isAfter(eventDate, today) || eventDate.getTime() === today.getTime();
      case 'past':
        return isBefore(eventDate, today);
      default:
        return true;
    }
  });

  const handleEmailReminder = (event: Event) => {
    setSelectedEvent(event);
    setShowEmailModal(true);
  };

  const sendEmailReminder = async () => {
    if (!selectedEvent || isSendingReminder || cooldownTime > 0) return;

    try {
      setIsSendingReminder(true);
      const response = await eventsService.sendReminder(selectedEvent.id);
      alert(`✅ ${response.message}\nEvento: ${response.event}\nEnviado para: ${response.sentTo}`);
      setShowEmailModal(false);
      setSelectedEvent(null);
      
      setCooldownTime(10);
    } catch (err: any) {
      console.error('Erro ao enviar lembrete:', err);
      alert('❌ Erro ao enviar lembrete: ' + (err.message || 'Verifica a configuração de email no servidor.'));
    } finally {
      setIsSendingReminder(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      startsAt: new Date(event.startsAt).toISOString().slice(0, 16),
      isPublic: event.isPublic
    });
    setShowEditModal(true);
  };

  const handleDelete = async (eventId: number) => {
    if (!confirm('Tens a certeza que queres eliminar este evento?')) {
      return;
    }

    try {
      await eventsService.delete(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      alert('Evento eliminado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao eliminar evento:', err);
      alert('Erro ao eliminar evento: ' + (err.message || 'Erro desconhecido'));
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEvent) return;

    try {
      setSubmitting(true);
      setError(null);

      const updated = await eventsService.update(editingEvent.id, {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        startsAt: new Date(formData.startsAt).toISOString(),
        isPublic: formData.isPublic
      });
      
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id ? updated : event
      ));
      
      closeEditModal();
      alert('Evento atualizado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao guardar evento:', err);
      setError(err.message || 'Erro ao guardar evento');
    } finally {
      setSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      location: '',
      startsAt: '',
      isPublic: true
    });
    setError(null);
  };

  return (
    <Layout>
      {}
      <section className="py-20 bg-gradient-to-br from-coisa-black to-coisa-black-light text-white">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Agenda de Concertos</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Não percas nenhum concerto da Coisa Mansa. Marca já na tua agenda!
          </p>
          
          {}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                filter === 'upcoming' 
                  ? 'bg-coisa-accent text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Próximos
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                filter === 'past' 
                  ? 'bg-coisa-accent text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Passados
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                filter === 'all' 
                  ? 'bg-coisa-accent text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Todos
            </button>
          </div>
        </div>
      </section>

      {}
      <section className="py-20 bg-coisa-gray/10">
        <div className="container-custom">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-coisa-accent mx-auto mb-4"></div>
              <p className="text-coisa-black/70">A carregar eventos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary">
                Tentar novamente
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-coisa-gray mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-coisa-black mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-coisa-black/70">
                {filter === 'upcoming' 
                  ? 'Não há eventos agendados para breve. Mantém-te atento!' 
                  : 'Não há eventos passados para mostrar.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="card group hover:scale-105 transition-transform duration-300">
                  <div className="flex flex-col h-full">
                    {}
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="w-5 h-5 text-coisa-accent" />
                      <span className="font-semibold text-coisa-black">
                        {format(parseISO(event.startsAt), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
                      </span>
                      <Clock className="w-5 h-5 text-coisa-accent ml-4" />
                      <span className="text-coisa-black/70">
                        {format(parseISO(event.startsAt), 'HH:mm')}
                      </span>
                      {!event.isPublic && isAdmin && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          Privado
                        </span>
                      )}
                    </div>

                    {}
                    <h3 className="text-2xl font-bold text-coisa-black mb-3 group-hover:text-coisa-accent transition-colors duration-200">
                      {event.title}
                    </h3>

                    {}
                    {event.location && (
                      <div className="flex items-start space-x-2 mb-2">
                        <MapPin className="w-5 h-5 text-coisa-accent mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-coisa-black">{event.location}</p>
                        </div>
                      </div>
                    )}

                    {}
                    {event.description && (
                      <p className="text-coisa-black/70 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-coisa-gray/20">
                      {}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {user && (
                          <button
                            onClick={() => handleEmailReminder(event)}
                            className="btn-secondary flex-1 inline-flex items-center justify-center space-x-2"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Lembrete</span>
                          </button>
                        )}

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEdit(event)}
                              className="btn-outline inline-flex items-center justify-center space-x-2"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="btn-outline text-red-500 border-red-500 hover:bg-red-500 hover:text-white inline-flex items-center justify-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Eliminar</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {}
      {showEmailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-coisa-black mb-4">
              Lembrete por Email
            </h3>
            <p className="text-coisa-black/70 mb-6">
              Queres receber um lembrete por email sobre o evento "{selectedEvent.title}"?
            </p>
            <div className="bg-coisa-gray/20 p-4 rounded-lg mb-6">
              <p className="text-sm text-coisa-black/80">
                <strong>Evento:</strong> {selectedEvent.title}<br />
                <strong>Data:</strong> {format(parseISO(selectedEvent.startsAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt })}<br />
                {selectedEvent.location && (
                  <><strong>Local:</strong> {selectedEvent.location}</>
                )}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={sendEmailReminder}
                disabled={isSendingReminder || cooldownTime > 0}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingReminder ? (
                  'A enviar...'
                ) : cooldownTime > 0 ? (
                  `Aguarda ${cooldownTime}s`
                ) : (
                  'Enviar Lembrete'
                )}
              </button>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setSelectedEvent(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-coisa-gray/30">
              <h3 className="text-2xl font-bold text-coisa-black">
                Editar Evento
              </h3>
            </div>
            
            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Título do Evento *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                  placeholder="Ex: Concerto ao vivo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                  placeholder="Descreve o evento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Localização *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                  placeholder="Ex: Casa da Música, Porto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Data e Hora *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startsAt}
                  onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4 text-coisa-accent border-coisa-gray/30 rounded focus:ring-coisa-accent"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-coisa-black">
                  Evento público (visível para todos os visitantes)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2 border border-coisa-gray/30 text-coisa-black rounded-lg hover:bg-coisa-gray/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'A guardar...' : 'Atualizar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      <section className="py-20 bg-coisa-black text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">
            Não percas nenhum concerto!
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Subscreve a nossa newsletter para seres o primeiro a saber sobre novos concertos e eventos especiais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="O teu email"
              className="flex-1 px-4 py-3 rounded-lg text-coisa-black"
            />
            <button className="btn-primary px-6 py-3">
              Subscrever
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};