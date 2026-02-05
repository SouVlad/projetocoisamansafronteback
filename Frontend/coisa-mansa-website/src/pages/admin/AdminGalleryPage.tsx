import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Upload, Image as ImageIcon, X, Grid, List } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { galleryService, GalleryImage } from '@/services/gallery.service';
import { albumService, Album } from '@/services/album.service';

export const AdminGalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    albumId: ''
  });

  // Carregar imagens e álbuns
  useEffect(() => {
    loadImages();
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      const data = await albumService.getAll();
      setAlbums(data);
    } catch (error: any) {
      console.error('Erro ao carregar álbuns:', error);
    }
  };

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAll();
      setImages(data);
    } catch (error: any) {
      console.error('Erro ao carregar imagens:', error);
      // Apenas mostrar alerta se for um erro real (não erro de conexão inicial)
      if (error.status && error.status !== 0 && error.response?.status !== 404) {
        alert('Erro ao conectar com o servidor. Verifica se o backend está a correr.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingImage) {
        // Atualizar imagem existente
        await galleryService.update(editingImage.id, {
          ...formData,
          albumId: formData.albumId ? parseInt(formData.albumId, 10) : undefined
        });
        alert('Imagem atualizada com sucesso!');
      } else {
        // Upload nova imagem
        if (!selectedFile || !formData.title) {
          alert('Seleciona um arquivo e preenche o título');
          return;
        }

        const uploadData = {
          title: formData.title,
          description: formData.description,
          albumId: formData.albumId ? parseInt(formData.albumId) : undefined
        };

        await galleryService.upload(selectedFile, uploadData);
        alert('Imagem carregada com sucesso!');
      }
      
      await loadImages();
      closeModal();
    } catch (error: any) {
      console.error('Erro ao salvar imagem:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      alert(errorMessage);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || '',
      albumId: image.albumId ? image.albumId.toString() : ''
    });
    setShowUploadModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tens a certeza que queres eliminar esta imagem?')) {
      return;
    }

    try {
      await galleryService.delete(id);
      alert('Imagem eliminada com sucesso!');
      await loadImages();
    } catch (error: any) {
      console.error('Erro ao eliminar imagem:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      alert(errorMessage);
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setEditingImage(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({
      title: '',
      description: '',
      albumId: ''
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Construir URL completa da imagem
  const getImageUrl = (filename: string) => {
    return `http://localhost:3000/uploads/gallery/${filename}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-coisa-black">Gestão de Galeria</h2>
            <p className="text-coisa-black/60 mt-1">
              Faz upload e organiza as imagens da banda
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex border border-coisa-gray/30 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-coisa-accent text-white' : 'text-coisa-black hover:bg-coisa-gray/10'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-coisa-accent text-white' : 'text-coisa-black hover:bg-coisa-gray/10'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Imagem</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Total de Imagens</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">{images.length}</p>
              </div>
              <ImageIcon className="w-10 h-10 text-coisa-accent/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Tamanho Total</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">
                  {formatFileSize(images.reduce((sum, img) => sum + img.size, 0))}
                </p>
              </div>
              <Upload className="w-10 h-10 text-blue-500/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Última Atualização</p>
                <p className="text-lg font-bold text-coisa-black mt-1">
                  {images.length > 0 
                    ? new Date(Math.max(...images.map(i => new Date(i.createdAt).getTime())))
                        .toLocaleDateString('pt-PT')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="card">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coisa-accent"></div>
              <p className="mt-4 text-coisa-black/60">A carregar imagens...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-coisa-gray mx-auto mb-4" />
              <h3 className="text-xl font-bold text-coisa-black mb-2">
                Nenhuma imagem na galeria
              </h3>
              <p className="text-coisa-black/60 mb-4">
                Faz o upload da primeira imagem para começar
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Imagem</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="group relative rounded-lg overflow-hidden bg-coisa-gray/10">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getImageUrl(image.filename)}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-semibold mb-1">{image.title}</h4>
                      {image.description && (
                        <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                      )}
                      <p className="text-white/60 text-xs mt-2">
                        {formatFileSize(image.size)} • {new Date(image.createdAt).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleEdit(image)}
                        className="p-2 bg-white/90 text-coisa-accent rounded-lg hover:bg-white transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="p-2 bg-white/90 text-red-500 rounded-lg hover:bg-white transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-coisa-gray/20">
              {images.map((image) => (
                <div key={image.id} className="flex items-center space-x-4 py-4 hover:bg-coisa-gray/5">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(image.filename)}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-coisa-black truncate">{image.title}</h4>
                    {image.description && (
                      <p className="text-sm text-coisa-black/60 line-clamp-1">{image.description}</p>
                    )}
                    <div className="flex items-center space-x-3 mt-1 text-xs text-coisa-black/50">
                      <span>{formatFileSize(image.size)}</span>
                      <span>•</span>
                      <span>{new Date(image.createdAt).toLocaleDateString('pt-PT')}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(image)}
                      className="p-2 text-coisa-accent hover:bg-coisa-accent/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload/Edit Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-coisa-gray/30 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-coisa-black">
                {editingImage ? 'Editar Imagem' : 'Upload Nova Imagem'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-coisa-black/60 hover:text-coisa-black hover:bg-coisa-gray/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editingImage && (
                <div>
                  <label className="block text-sm font-medium text-coisa-black mb-2">
                    Selecionar Imagem *
                  </label>
                  <div className="border-2 border-dashed border-coisa-gray/30 rounded-lg p-8 text-center">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-coisa-gray mx-auto mb-4" />
                        <label className="btn-primary cursor-pointer inline-block">
                          Escolher Arquivo
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-coisa-black/60 mt-2">
                          Formatos aceites: JPG, PNG, GIF, WebP, MP4 (máx. 50MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                  placeholder="Ex: Concerto na Casa da Música..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                  placeholder="Descrição opcional..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Álbum (Pasta)
                </label>
                <select
                  value={formData.albumId}
                  onChange={(e) => setFormData({ ...formData, albumId: e.target.value })}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                >
                  <option value="">Sem álbum</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-coisa-black/60 mt-1">
                  Seleciona um álbum para organizar a imagem
                </p>
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
                  className="btn-primary"
                  disabled={!editingImage && !selectedFile}
                >
                  {editingImage ? 'Atualizar' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
