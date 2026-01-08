/**
 * Exemplo de página de galeria integrada com o backend
 * Substitui a implementação mock pela versão real
 */

import React, { useState } from 'react';
import { useGallery } from '@/hooks/useGallery';

export const GalleryPageExample: React.FC = () => {
  const { images, loading, error } = useGallery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-xl">Carregando galeria...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Erro ao carregar galeria</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Galeria</h1>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            Nenhuma foto disponível no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => setSelectedImage(image.imageUrl)}
            >
              <img
                src={image.thumbnailUrl || image.imageUrl}
                alt={image.title || 'Foto da galeria'}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-sm font-semibold truncate">{image.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal para visualizar imagem em tamanho completo */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Imagem ampliada"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
