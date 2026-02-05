import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, Shield, Save, X } from 'lucide-react';
import { authService } from '@/services/auth.service';

export const ProfilePage: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-coisa-accent mx-auto"></div>
            <p className="mt-4 text-coisa-black/70">A carregar perfil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('As passwords não coincidem');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('A nova password deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setIsSaving(true);

      const updateData: any = {
        username: formData.username,
        email: formData.email,
      };

      const isPasswordChange = !!formData.newPassword;

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      console.log('Enviando dados para atualizar:', updateData);
      const updatedUser = await authService.updateProfile(updateData);
      console.log('Usuário atualizado recebido:', updatedUser);

      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      if (isPasswordChange) {
        setTimeout(() => {
          logout();
          navigate('/login', { state: { message: 'Password alterada com sucesso. Por favor, faça login novamente.' } });
        }, 1500);
      } else {
        
        setTimeout(() => {
          console.log('Recarregando página...');
          window.location.reload();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      const errorMessage = err?.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    setFormData({
      username: user.username,
      email: user.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'Proprietário';
      case 'ADMIN':
        return 'Administrador';
      default:
        return 'Utilizador';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-700';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      {}
      <section className="py-20 bg-gradient-to-br from-coisa-black to-coisa-black-light text-white">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Meu Perfil</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Gere as tuas informações pessoais e preferências
          </p>
        </div>
      </section>

      {}
      <section className="py-20 bg-coisa-gray/10">
        <div className="container-custom max-w-4xl">
          {}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {}
          <div className="card">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-coisa-gray/20">
              <h2 className="text-2xl font-bold text-coisa-black">Informações do Perfil</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary"
                >
                  Editar Perfil
                </button>
              )}
            </div>

            {!isEditing ? (
              
              <div className="space-y-6">
                {}
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-coisa-accent/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-coisa-accent">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-coisa-black/60">
                      <User className="w-4 h-4 mr-2" />
                      Nome de Utilizador
                    </label>
                    <p className="text-lg font-semibold text-coisa-black">{user.username}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-coisa-black/60">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </label>
                    <p className="text-lg font-semibold text-coisa-black">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-coisa-black/60">
                      <Shield className="w-4 h-4 mr-2" />
                      Role
                    </label>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${getRoleColor(user.role)}`}>
                      {getRoleName(user.role)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-coisa-black/60">
                      <Calendar className="w-4 h-4 mr-2" />
                      Membro desde
                    </label>
                    <p className="text-lg font-semibold text-coisa-black">
                      {new Date(user.createdAt).toLocaleDateString('pt-PT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-coisa-black mb-2">
                      Nome de Utilizador *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coisa-black/40" />
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                        placeholder="Nome de utilizador"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-coisa-black mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coisa-black/40" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                        placeholder="email@exemplo.com"
                      />
                    </div>
                  </div>
                </div>

                {}
                <div className="pt-6 border-t border-coisa-gray/20">
                  <h3 className="text-lg font-semibold text-coisa-black mb-4">
                    Alterar Password (opcional)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-coisa-black mb-2">
                        Password Atual
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coisa-black/40" />
                        <input
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                          placeholder="Deixa em branco se não quiseres alterar"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-coisa-black mb-2">
                          Nova Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coisa-black/40" />
                          <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                            placeholder="Mínimo 6 caracteres"
                            minLength={6}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-coisa-black mb-2">
                          Confirmar Nova Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coisa-black/40" />
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-coisa-gray/30 rounded-lg focus:ring-2 focus:ring-coisa-accent focus:border-transparent"
                            placeholder="Confirma a nova password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="flex items-center justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-coisa-gray/30 text-coisa-black rounded-lg hover:bg-coisa-gray/10 transition-colors inline-flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'A guardar...' : 'Guardar Alterações'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {}
          <div className="mt-8 card bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 rounded-full p-2 flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-coisa-black mb-1">Segurança da Conta</h4>
                <p className="text-coisa-black/70 text-sm">
                  Mantém a tua conta segura usando uma password forte e nunca a partilhes com ninguém. 
                  Se suspeitas de atividade não autorizada, altera a tua password imediatamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
