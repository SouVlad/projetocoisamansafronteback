import React, { useState, useEffect } from 'react';
import { Camera, X, Loader2, FolderOpen, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import type { GalleryImage } from '@/services/gallery.service';
import { albumService, Album } from '@/services/album.service';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Carregar álbuns e imagens do backend
  useEffect(() => {
    loadAlbums();
    if (selectedAlbum) {
      loadAlbumImages(selectedAlbum.id);
    }
  }, [selectedAlbum]);

  const loadAlbums = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await albumService.getAll();
      setAlbums(data);
    } catch (err: any) {
      console.error('Erro ao carregar álbuns:', err);
      setError('Erro ao carregar álbuns da galeria');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAlbumImages = async (albumId: number) => {
    try {
      setIsLoading(true);
      const album = await albumService.getById(albumId);
      setImages(album.images || []);
    } catch (err: any) {
      console.error('Erro ao carregar imagens do álbum:', err);
      setError('Erro ao carregar imagens');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getImageUrl = (filename: string) => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    if (filename.includes('/uploads/')) {
      return `http://localhost:3000${filename.startsWith('/') ? filename : '/' + filename}`;
    }
    return `http://localhost:3000/uploads/gallery/${filename}`;
  };

  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-coisa-black to-coisa-black-light text-white">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Galeria</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Explora os nossos momentos únicos: concertos, bastidores, sessões de estúdio e muito mais.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-coisa-gray/10">
        <div className="container-custom">
          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-16 h-16 text-coisa-accent mx-auto mb-4 animate-spin" />
              <h3 className="text-2xl font-bold text-coisa-black mb-2">
                A carregar galeria...
              </h3>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <Camera className="w-16 h-16 text-coisa-gray mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-coisa-black mb-2">
                Erro ao Carregar
              </h3>
              <p className="text-coisa-black/70 mb-4">{error}</p>
              <button onClick={loadAlbums} className="btn-primary">
                Tentar Novamente
              </button>
            </div>
          ) : !selectedAlbum ? (
            /* Albums Grid */
            <div>
              {albums.length === 0 ? (
                <div className="text-center py-16">
                  <FolderOpen className="w-16 h-16 text-coisa-gray mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-coisa-black mb-2">
                    Nenhum álbum disponível
                  </h3>
                  <p className="text-coisa-black/70">
                    Ainda não existem álbuns na galeria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {albums.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => setSelectedAlbum(album)}
                      className="card group cursor-pointer hover:scale-105 transition-transform duration-300"
                    >
                      <div className="aspect-video overflow-hidden rounded-t-lg bg-coisa-gray/20 flex items-center justify-center">
                        {album.images && album.images.length > 0 ? (
                          <img
                            src={getImageUrl(album.images[0].filename)}
                            alt={album.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <FolderOpen className="w-16 h-16 text-coisa-gray" />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-coisa-black group-hover:text-coisa-accent transition-colors">
                          {album.name}
                        </h3>
                        {album.description && (
                          <p className="text-sm text-coisa-black/60 mt-1 line-clamp-2">
                            {album.description}
                          </p>
                        )}
                        <p className="text-sm text-coisa-accent font-medium mt-2">
                          {album._count?.images || 0} {album._count?.images === 1 ? 'imagem' : 'imagens'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Album Images */
            <div>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="btn-secondary inline-flex items-center space-x-2 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar aos álbuns</span>
              </button>

              <h2 className="text-3xl font-bold text-coisa-black mb-2">{selectedAlbum.name}</h2>
              {selectedAlbum.description && (
                <p className="text-coisa-black/70 mb-6">{selectedAlbum.description}</p>
              )}

              {images.length === 0 ? (
                <div className="text-center py-16">
                  <Camera className="w-16 h-16 text-coisa-gray mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-coisa-black mb-2">
                    Álbum vazio
                  </h3>
                  <p className="text-coisa-black/70">
                    Este álbum ainda não tem imagens.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="card overflow-hidden group cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={getImageUrl(image.filename)}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-coisa-black mb-2 group-hover:text-coisa-accent transition-colors duration-200">
                          {image.title}
                        </h3>
                        {image.description && (
                          <p className="text-coisa-black/70 text-sm mb-2">
                            {image.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-coisa-black/50">
                          <span>{new Date(image.createdAt).toLocaleDateString('pt-PT')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full bg-white rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src={getImageUrl(selectedImage.filename)}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-coisa-black mb-2">
                {selectedImage.title}
              </h3>
              {selectedImage.description && (
                <p className="text-coisa-black/70 mb-4">
                  {selectedImage.description}
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-coisa-black/50">
                <span>{new Date(selectedImage.createdAt).toLocaleDateString('pt-PT')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};