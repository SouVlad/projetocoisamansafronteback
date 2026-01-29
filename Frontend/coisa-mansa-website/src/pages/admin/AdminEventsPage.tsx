import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { eventsService } from '@/services/events.service';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: Date;
  isPublic: boolean;
  createdBy: string;
}

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startsAt: '',
    isPublic: true
  });

  // Carregar eventos do backend
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getAll();
      setEvents(data as any);
    } catch (err: any) {
      console.error('Erro ao carregar eventos:', err);
      setError(err.message || 'Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      if (editingEvent) {
        // Atualizar evento existente
        const updated = await eventsService.update(Number(editingEvent.id), {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          startsAt: new Date(formData.startsAt).toISOString(),
          isPublic: formData.isPublic
        });
        
        setEvents(prev => prev.map(event => 
          event.id === editingEvent.id ? updated as any : event
        ));
      } else {
        // Criar novo evento
        const created = await eventsService.create({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          startsAt: new Date(formData.startsAt).toISOString(),
          isPublic: formData.isPublic
        });
        
        setEvents(prev => [created as any, ...prev]);
      }
      
      closeModal();
    } catch (err: any) {
      console.error('Erro ao guardar evento:', err);
      setError(err.message || 'Erro ao guardar evento');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      startsAt: new Date(event.startsAt).toISOString().slice(0, 16),
      isPublic: event.isPublic
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tens a certeza que queres eliminar este evento?')) {
      try {
        await eventsService.delete(Number(id));
        setEvents(prev => prev.filter(event => event.id !== id));
      } catch (err: any) {
        console.error('Erro ao eliminar evento:', err);
        alert('Erro ao eliminar evento: ' + (err.message || 'Erro desconhecido'));
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      location: '',
      startsAt: '',
      isPublic: true
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-coisa-black">Gestão de Eventos</h2>
            <p className="text-coisa-black/60 mt-1">
              Cria e gere os eventos da banda
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Evento</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Total de Eventos</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">{events.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-coisa-accent/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Eventos Públicos</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">
                  {events.filter(e => e.isPublic).length}
                </p>
              </div>
              <Eye className="w-10 h-10 text-green-500/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Eventos Privados</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">
                  {events.filter(e => !e.isPublic).length}
                </p>
              </div>
              <EyeOff className="w-10 h-10 text-orange-500/30" />
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-coisa-gray/30">
                  <th className="text-left py-3 px-4 text-coisa-black font-semibold">Evento</th>
                  <th className="text-left py-3 px-4 text-coisa-black font-semibold">Localização</th>
                  <th className="text-left py-3 px-4 text-coisa-black font-semibold">Data</th>
                  <th className="text-left py-3 px-4 text-coisa-black font-semibold">Visibilidade</th>
                  <th className="text-right py-3 px-4 text-coisa-black font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-coisa-black/60">
                      A carregar eventos...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-coisa-black/60">
                      Nenhum evento criado. Clica em "Novo Evento" para começar.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="border-b border-coisa-gray/20 hover:bg-coisa-gray/5">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-coisa-black">{event.title}</p>
                          <p className="text-sm text-coisa-black/60 line-clamp-1">{event.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 text-coisa-black/70">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-coisa-black/70">
                          {new Date(event.startsAt).toLocaleDateString('pt-PT', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                          <br />
                          {new Date(event.startsAt).toLocaleTimeString('pt-PT', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.isPublic 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {event.isPublic ? 'Público' : 'Privado'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="p-2 text-coisa-accent hover:bg-coisa-accent/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-coisa-gray/30">
              <h3 className="text-2xl font-bold text-coisa-black">
                {editingEvent ? 'Editar Evento' : 'Novo Evento'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  onClick={closeModal}
                  className="px-6 py-2 border border-coisa-gray/30 text-coisa-black rounded-lg hover:bg-coisa-gray/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'A guardar...' : (editingEvent ? 'Atualizar' : 'Criar') + ' Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
