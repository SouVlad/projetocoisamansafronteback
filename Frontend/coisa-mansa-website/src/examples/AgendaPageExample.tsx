/**
 * Exemplo de página de eventos integrada com o backend
 * Substitui a implementação mock pela versão real
 */

import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AgendaPageExample: React.FC = () => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-xl">Carregando eventos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Erro ao carregar eventos</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Próximos Shows</h1>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            Não há eventos agendados no momento.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">📅</span>
                    {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  
                  {event.time && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">🕐</span>
                      {event.time}
                    </p>
                  )}
                  
                  {event.location && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">📍</span>
                      {event.venue ? `${event.venue}, ${event.location}` : event.location}
                    </p>
                  )}
                  
                  {event.price !== undefined && event.price > 0 && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">💰</span>
                      €{event.price.toFixed(2)}
                    </p>
                  )}
                </div>

                {event.description && (
                  <p className="mt-4 text-gray-700">{event.description}</p>
                )}

                {event.ticketLink && (
                  <a
                    href={event.ticketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Comprar Bilhetes
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
