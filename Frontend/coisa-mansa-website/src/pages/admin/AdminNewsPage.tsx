import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Newspaper, Eye, EyeOff, Calendar } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { newsService, NewsArticle } from '@/services/news.service';

export const AdminNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    isPublished: true
  });

  // Carregar artigos
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAllArticles();
      setArticles(data);
    } catch (error: any) {
      console.error('Erro ao carregar artigos:', error);
      // Apenas mostrar alerta se for um erro real (não 404 ou array vazio)
      if (error.response?.status !== 404) {
        alert('Erro ao conectar com o servidor. Verifica se o backend está a correr.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const articleData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        isPublished: formData.isPublished
      };

      if (editingArticle) {
        // Atualizar artigo
        await newsService.update(editingArticle.id, articleData);
        alert('Artigo atualizado com sucesso!');
      } else {
        // Criar novo artigo
        await newsService.create(articleData);
        alert('Artigo criado com sucesso!');
      }
      
      await loadArticles();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar artigo:', error);
      alert('Erro ao salvar artigo');
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      summary: article.summary,
      content: article.content,
      isPublished: article.isPublished
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tens a certeza que queres eliminar este artigo?')) {
      return;
    }

    try {
      await newsService.delete(id);
      alert('Artigo eliminado com sucesso!');
      await loadArticles();
    } catch (error) {
      console.error('Erro ao eliminar artigo:', error);
      alert('Erro ao eliminar artigo');
    }
  };

  const togglePublish = async (id: number) => {
    try {
      await newsService.togglePublish(id);
      await loadArticles();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status da publicação');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      isPublished: true
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-coisa-black">Gestão de Notícias</h2>
            <p className="text-coisa-black/60 mt-1">
              Cria e publica notícias sobre a banda
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Notícia</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Total de Notícias</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">{articles.length}</p>
              </div>
              <Newspaper className="w-10 h-10 text-coisa-accent/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Publicadas</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">
                  {articles.filter(a => a.isPublished).length}
                </p>
              </div>
              <Eye className="w-10 h-10 text-green-500/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Rascunhos</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">
                  {articles.filter(a => !a.isPublished).length}
                </p>
              </div>
              <EyeOff className="w-10 h-10 text-orange-500/30" />
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {loading ? (
            <div className="card text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coisa-accent"></div>
              <p className="mt-4 text-coisa-black/60">A carregar artigos...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="card text-center py-16">
              <Newspaper className="w-16 h-16 text-coisa-gray mx-auto mb-4" />
              <h3 className="text-xl font-bold text-coisa-black mb-2">
                Nenhuma notícia criada
              </h3>
              <p className="text-coisa-black/60 mb-4">
                Cria a primeira notícia para começar
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nova Notícia</span>
              </button>
            </div>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-coisa-black">
                        {article.title}
                      </h3>
                      <button
                        onClick={() => togglePublish(article.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                          article.isPublished
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {article.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Publicado</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Rascunho</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <p className="text-coisa-black/70 mb-3">
                      {article.summary}
                    </p>
                    
                    <p className="text-coisa-black/60 text-sm line-clamp-2 mb-4">
                      {article.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-coisa-black/50">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString('pt-PT', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })
                            : 'Não publicado'}
                        </span>
                      </div>
                      <span>•</span>
                      <span>por {article.author.username}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 text-coisa-accent hover:bg-coisa-accent/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-coisa-gray/30">
              <h3 className="text-2xl font-bold text-coisa-black">
                {editingArticle ? 'Editar Notícia' : 'Nova Notícia'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  placeholder="Ex: Novo álbum em preparação..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Resumo *
                </label>
                <textarea
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                  placeholder="Breve resumo da notícia..."
                />
                <p className="text-xs text-coisa-black/50 mt-1">
                  Este resumo aparecerá nas listas de notícias
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Conteúdo *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                  placeholder="Escreve o conteúdo completo da notícia..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-coisa-accent border-coisa-gray/30 rounded focus:ring-coisa-accent"
                />
                <label htmlFor="isPublished" className="ml-2 text-sm text-coisa-black">
                  Publicar imediatamente (visível para todos os visitantes)
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
                  {editingArticle ? 'Atualizar' : 'Criar'} Notícia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
