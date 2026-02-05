import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderOpen, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { albumService, Album } from '@/services/album.service';

export const AdminAlbumsPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
    order: 0
  });

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const data = await albumService.getAll();
      setAlbums(data);
    } catch (error: any) {
      console.error('Erro ao carregar álbuns:', error);
      alert('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAlbum) {
        await albumService.update(editingAlbum.id, formData);
        alert('Álbum atualizado com sucesso!');
      } else {
        await albumService.create(formData);
        alert('Álbum criado com sucesso!');
      }
      
      await loadAlbums();
      closeModal();
    } catch (error: any) {
      console.error('Erro ao salvar álbum:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      alert(errorMessage);
    }
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setFormData({
      name: album.name,
      description: album.description || '',
      isPublic: album.isPublic,
      order: album.order
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tens a certeza que queres eliminar este álbum? (Apenas álbuns vazios podem ser eliminados)')) {
      return;
    }

    try {
      await albumService.delete(id);
      alert('Álbum eliminado com sucesso!');
      await loadAlbums();
    } catch (error: any) {
      console.error('Erro ao eliminar álbum:', error);
      const errorMessage = error?.message || 'Erro ao eliminar álbum';
      alert(errorMessage);
    }
  };

  const togglePublic = async (album: Album) => {
    try {
      await albumService.update(album.id, { isPublic: !album.isPublic });
      await loadAlbums();
    } catch (error: any) {
      console.error('Erro ao atualizar álbum:', error);
      const errorMessage = error?.message || 'Erro ao atualizar álbum';
      alert(errorMessage);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAlbum(null);
    setFormData({
      name: '',
      description: '',
      isPublic: true,
      order: 0
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-coisa-black">Gestão de Álbuns</h2>
            <p className="text-coisa-black/60 mt-1">
              Organiza as imagens da galeria em álbuns
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Álbum</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Total de Álbuns</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">{albums.length}</p>
              </div>
              <FolderOpen className="w-10 h-10 text-coisa-accent/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Álbuns Públicos</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">
                  {albums.filter(a => a.isPublic).length}
                </p>
              </div>
              <Eye className="w-10 h-10 text-green-500/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Total de Imagens</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">
                  {albums.reduce((sum, a) => sum + (a._count?.images || 0), 0)}
                </p>
              </div>
              <ImageIcon className="w-10 h-10 text-blue-500/30" />
            </div>
          </div>
        </div>

        {/* Albums Grid */}
        <div className="card">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coisa-accent"></div>
              <p className="mt-4 text-coisa-black/60">A carregar álbuns...</p>
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen className="w-16 h-16 text-coisa-gray mx-auto mb-4" />
              <h3 className="text-xl font-bold text-coisa-black mb-2">
                Nenhum álbum criado
              </h3>
              <p className="text-coisa-black/70 mb-6">
                Cria o primeiro álbum para organizar as imagens da galeria.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Álbum</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-coisa-gray/30">
                    <th className="text-left py-3 px-4 text-coisa-black font-semibold">Álbum</th>
                    <th className="text-left py-3 px-4 text-coisa-black font-semibold">Imagens</th>
                    <th className="text-left py-3 px-4 text-coisa-black font-semibold">Ordem</th>
                    <th className="text-left py-3 px-4 text-coisa-black font-semibold">Visibilidade</th>
                    <th className="text-right py-3 px-4 text-coisa-black font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {albums.map((album) => (
                    <tr key={album.id} className="border-b border-coisa-gray/10 hover:bg-coisa-gray/5">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <FolderOpen className="w-10 h-10 text-coisa-accent" />
                          <div>
                            <p className="font-semibold text-coisa-black">{album.name}</p>
                            {album.description && (
                              <p className="text-sm text-coisa-black/60 line-clamp-1">{album.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-coisa-black">
                          {album._count?.images || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-coisa-black">{album.order}</span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => togglePublic(album)}
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                            album.isPublic
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {album.isPublic ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Público</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Privado</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(album)}
                            className="p-2 text-coisa-black/60 hover:text-coisa-accent hover:bg-coisa-gray/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(album.id)}
                            className="p-2 text-coisa-black/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-coisa-gray/30">
              <h3 className="text-2xl font-bold text-coisa-black">
                {editingAlbum ? 'Editar Álbum' : 'Novo Álbum'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Nome do Álbum *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                  placeholder="Ex: Concertos 2023"
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
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4 text-coisa-accent border-coisa-gray/30 rounded focus:ring-coisa-accent"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-coisa-black">
                  Visível na galeria pública
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
                  className="btn-primary"
                >
                  {editingAlbum ? 'Atualizar' : 'Criar'} Álbum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
