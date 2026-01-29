import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, DollarSign, Archive, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { merchService } from '@/services/merch.service';
import { MerchItem } from '@/types';

export const AdminMerchPage: React.FC = () => {
  const [products, setProducts] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MerchItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    isActive: true
  });

  // Carregar produtos
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await merchService.getAll();
      setProducts(data);
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error);
      // Apenas mostrar alerta se for um erro real de conexão
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
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        available: formData.isActive
      };

      if (editingProduct) {
        // Atualizar produto
        await merchService.update(editingProduct.id, selectedFile, productData);
        alert('Produto atualizado com sucesso!');
      } else {
        // Criar novo produto
        if (!formData.name || !formData.price) {
          alert('Nome e preço são obrigatórios');
          return;
        }
        await merchService.create(selectedFile, productData);
        alert('Produto criado com sucesso!');
      }
      
      await loadProducts();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto');
    }
  };

  const handleEdit = (product: MerchItem) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      isActive: product.isActive ?? true
    });
    // Carregar preview da imagem existente
    if (product.imageUrl) {
      setPreviewUrl(`http://localhost:3000${product.imageUrl}`);
    }
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tens a certeza que queres eliminar este produto?')) {
      return;
    }

    try {
      await merchService.delete(id);
      alert('Produto eliminado com sucesso!');
      await loadProducts();
    } catch (error) {
      console.error('Erro ao eliminar produto:', error);
      alert('Erro ao eliminar produto');
    }
  };

  const toggleActive = async (id: number) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      await merchService.update(id, null, { available: !product.isActive });
      await loadProducts();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do produto');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      isActive: true
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Cálculos de estatísticas
  const activeProducts = products.filter(p => p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-coisa-black">Gestão de Merchandising</h2>
            <p className="text-coisa-black/60 mt-1">
              Gere os produtos da banda
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Produto</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Total Produtos</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">{products.length}</p>
              </div>
              <Package className="w-10 h-10 text-coisa-accent/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Produtos Ativos</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">{activeProducts}</p>
              </div>
              <Eye className="w-10 h-10 text-green-500/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Stock Total</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">{totalStock}</p>
              </div>
              <Archive className="w-10 h-10 text-blue-500/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Receita Estimada</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">€{totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-500/30" />
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="card">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coisa-accent"></div>
              <p className="mt-4 text-coisa-black/60">A carregar produtos...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-coisa-gray/30">
                  <th className="text-left py-3 px-4 text-coisa-black font-semibold">Produto</th>
                  <th className="text-left py-3 px-4 text-coisa-black font-semibold">Preço</th>
                  <th className="text-left py-3 px-4 text-coisa-black font-semibold">Stock</th>
                  <th className="text-left py-3 px-4 text-coisa-black font-semibold">Estado</th>
                  <th className="text-right py-3 px-4 text-coisa-black font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-coisa-black/60">
                      Nenhum produto criado. Clica em "Novo Produto" para começar.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b border-coisa-gray/20 hover:bg-coisa-gray/5">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {product.imageUrl && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={`http://localhost:3000${product.imageUrl}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-coisa-black">{product.name}</p>
                            <p className="text-sm text-coisa-black/60 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-coisa-black">€{product.price.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${
                          product.stock === 0 
                            ? 'text-red-500' 
                            : product.stock < 10 
                            ? 'text-orange-500' 
                            : 'text-green-600'
                        }`}>
                          {product.stock} unidades
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleActive(product.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                            product.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {product.isActive ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Ativo</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Inativo</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-coisa-accent hover:bg-coisa-accent/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
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
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-coisa-gray/30">
              <h3 className="text-2xl font-bold text-coisa-black">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                  placeholder="Ex: T-Shirt Coisa Mansa..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Descrição *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                  placeholder="Descreve o produto..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-coisa-black mb-2">
                    Preço (€) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                    placeholder="19.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-coisa-black mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-2">
                  Imagem do Produto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                />
                {previewUrl && (
                  <div className="mt-2">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-coisa-accent border-coisa-gray/30 rounded focus:ring-coisa-accent"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-coisa-black">
                  Produto ativo (visível na loja)
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
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
