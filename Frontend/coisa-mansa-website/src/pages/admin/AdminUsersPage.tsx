import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Users, Shield, User as UserIcon, Mail, Calendar } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { userService } from '@/services/user.service';
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'USER' as 'USER' | 'ADMIN' | 'OWNER'
  });

  useEffect(() => {
    console.log('🎬 AdminUsersPage montada');
    console.log('👤 Current user no mount:', currentUser);
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Iniciando carregamento de utilizadores...');
      console.log('👤 Utilizador atual:', currentUser);
      
      const data = await userService.getAll();
      
      console.log('✅ Utilizadores carregados com sucesso:', data);
      console.log('📊 Total de utilizadores:', data.length);
      
      // O backend já filtra os utilizadores baseado no role
      // OWNER vê todos, ADMIN vê apenas USER
      setUsers(data);
    } catch (error: any) {
      console.error('❌ Erro ao carregar utilizadores:', error);
      console.error('Status do erro:', error.response?.status);
      console.error('Dados do erro:', error.response?.data);
      console.error('Mensagem:', error.message);
      
      // Mensagens de erro mais específicas
      if (error.response?.status === 403) {
        alert('Sem permissão para ver utilizadores. Verifica se tens um role de ADMIN ou OWNER.');
      } else if (error.response?.status === 401) {
        alert('Não estás autenticado. Por favor, faz login novamente.');
      } else if (!error.response || error.status === 0) {
        alert('Erro ao conectar com o servidor. Verifica se o backend está a correr em http://localhost:3000');
      } else {
        alert(`Erro ao carregar utilizadores: ${error.response?.data?.error || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;

    try {
      await userService.update(editingUser.id, formData);
      alert('Utilizador atualizado com sucesso!');
      await loadUsers();
      closeModal();
    } catch (error: any) {
      console.error('Erro ao atualizar utilizador:', error);
      alert(error.response?.data?.error || 'Erro ao atualizar utilizador');
    }
  };

  const handleDelete = async (id: number, username: string, role: string) => {
    // Admins não podem deletar outros admins
    if (currentUser?.role === 'ADMIN' && role === 'ADMIN') {
      alert('Não tens permissão para eliminar outros administradores.');
      return;
    }

    if (!confirm(`Tens a certeza que queres eliminar o utilizador "${username}"?`)) {
      return;
    }

    try {
      await userService.delete(id);
      alert('Utilizador eliminado com sucesso!');
      await loadUsers();
    } catch (error: any) {
      console.error('Erro ao eliminar utilizador:', error);
      alert(error.response?.data?.error || 'Erro ao eliminar utilizador');
    }
  };

  const closeModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setFormData({ username: '', email: '', role: 'USER' });
  };

  // Estatísticas
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const userCount = users.filter(u => u.role === 'USER').length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700';
      case 'USER':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-4 h-4" />;
      case 'USER':
        return <UserIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const canDelete = (user: User) => {
    // Owner nunca aparece na lista
    if (user.role === 'OWNER') return false;
    
    // Admin não pode deletar outro admin
    if (currentUser?.role === 'ADMIN' && user.role === 'ADMIN') return false;
    
    return true;
  };

  const canEdit = (user: User) => {
    // Owner pode editar todos (mas owners não aparecem na lista)
    if (currentUser?.role === 'OWNER') return true;
    
    // Admin não pode editar outro admin
    if (currentUser?.role === 'ADMIN' && user.role === 'ADMIN') return false;
    
    return true;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-coisa-black">Gestão de Utilizadores</h2>
            <p className="text-coisa-black/60 mt-1">
              Gere os utilizadores e administradores da plataforma
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Total de Utilizadores</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">{totalUsers}</p>
              </div>
              <Users className="w-10 h-10 text-coisa-accent/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Administradores</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">{adminCount}</p>
              </div>
              <Shield className="w-10 h-10 text-purple-500/30" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coisa-black/60 text-sm">Utilizadores Normais</p>
                <p className="text-3xl font-bold text-coisa-black mt-1">{userCount}</p>
              </div>
              <UserIcon className="w-10 h-10 text-blue-500/30" />
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="card">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coisa-accent"></div>
              <p className="mt-4 text-coisa-black/60">A carregar utilizadores...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-coisa-gray/30">
                    <th className="text-left py-3 px-4 text-coisa-black font-semibold">Utilizador</th>
                    <th className="text-left py-3 px-4 text-coisa-black font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-coisa-black font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-coisa-black font-semibold">Registado</th>
                    <th className="text-right py-3 px-4 text-coisa-black font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-coisa-black/60">
                        {currentUser?.role === 'ADMIN' 
                          ? 'Nenhum utilizador (USER) encontrado. Os administradores não podem ver outros administradores.'
                          : 'Nenhum utilizador encontrado.'}
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-coisa-gray/20 hover:bg-coisa-gray/5">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-coisa-accent/10 flex items-center justify-center">
                              <span className="text-coisa-accent font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-coisa-black">{user.username}</p>
                              <p className="text-xs text-coisa-black/50">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2 text-coisa-black/70">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center space-x-1 ${getRoleBadge(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span>{user.role}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2 text-sm text-coisa-black/60">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(user.createdAt).toLocaleDateString('pt-PT')}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            {canEdit(user) && (
                              <button
                                onClick={() => handleEdit(user)}
                                className="p-2 text-coisa-accent hover:bg-coisa-accent/10 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {canDelete(user) && (
                              <button
                                onClick={() => handleDelete(user.id, user.username, user.role)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            {!canEdit(user) && !canDelete(user) && (
                              <span className="text-xs text-coisa-black/40 italic">Sem permissão</span>
                            )}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-coisa-black mb-4">
              Editar Utilizador
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-coisa-black mb-1">
                  Nome de Utilizador
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-coisa-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-coisa-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-coisa-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-coisa-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coisa-black mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'USER' | 'ADMIN' | 'OWNER' })}
                  className="w-full px-3 py-2 border border-coisa-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-coisa-accent"
                  disabled={currentUser?.role === 'ADMIN'}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  {currentUser?.role === 'OWNER' && <option value="OWNER">OWNER</option>}
                </select>
                {currentUser?.role === 'ADMIN' && (
                  <p className="text-xs text-coisa-black/50 mt-1">
                    Apenas o Owner pode alterar roles
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-coisa-gray/30 rounded-lg hover:bg-coisa-gray/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
