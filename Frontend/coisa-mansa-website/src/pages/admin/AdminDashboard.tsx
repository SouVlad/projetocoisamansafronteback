import React, { useState } from 'react';
import { Calendar, Camera, Package, Users, Settings, BarChart3, Plus, Edit, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'concerts' | 'gallery' | 'merch' | 'users' | 'settings'>('overview');

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'concerts', label: 'Concertos', icon: Calendar },
    { id: 'gallery', label: 'Galeria', icon: Camera },
    { id: 'merch', label: 'Merchandising', icon: Package },
    { id: 'users', label: 'Utilizadores', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const stats = [
    { label: 'Concertos Agendados', value: '8', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Imagens na Galeria', value: '24', icon: Camera, color: 'bg-green-500' },
    { label: 'Produtos no Stock', value: '15', icon: Package, color: 'bg-purple-500' },
    { label: 'Utilizadores Registados', value: '156', icon: Users, color: 'bg-orange-500' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-full p-3 mr-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-coisa-black">{stat.value}</p>
                <p className="text-coisa-black/70 text-sm">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-bold text-coisa-black mb-4">Atividade Recente</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-coisa-gray/10 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-coisa-black">Novo concierto adicionado para 15 de Janeiro</p>
              <p className="text-coisa-black/60 text-sm">Há 2 horas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-coisa-gray/10 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-coisa-black">5 novas imagens carregadas na galeria</p>
              <p className="text-coisa-black/60 text-sm">Há 1 dia</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-coisa-gray/10 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-coisa-black">3 utilizadores novos registados</p>
              <p className="text-coisa-black/60 text-sm">Há 2 dias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="card hover:scale-105 transition-transform duration-200 text-center">
          <Plus className="w-12 h-12 text-coisa-accent mx-auto mb-3" />
          <h4 className="font-bold text-coisa-black mb-2">Novo Concerto</h4>
          <p className="text-coisa-black/70 text-sm">Adicionar um novo concierto à agenda</p>
        </button>
        <button className="card hover:scale-105 transition-transform duration-200 text-center">
          <Camera className="w-12 h-12 text-coisa-accent mx-auto mb-3" />
          <h4 className="font-bold text-coisa-black mb-2">Upload Imagem</h4>
          <p className="text-coisa-black/70 text-sm">Adicionar novas imagens à galeria</p>
        </button>
        <button className="card hover:scale-105 transition-transform duration-200 text-center">
          <Package className="w-12 h-12 text-coisa-accent mx-auto mb-3" />
          <h4 className="font-bold text-coisa-black mb-2">Novo Produto</h4>
          <p className="text-coisa-black/70 text-sm">Adicionar produto ao merchandising</p>
        </button>
      </div>
    </div>
  );

  const renderConcerts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-coisa-black">Gestão de Concertos</h3>
        <button className="btn-primary inline-flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Novo Concerto</span>
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-coisa-gray/20">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Data</th>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Título</th>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Local</th>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Preço</th>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coisa-gray/20">
              <tr>
                <td className="py-3 px-4 text-coisa-black">15 Jan 2025</td>
                <td className="py-3 px-4 text-coisa-black">Coisa Mansa ao Vivo</td>
                <td className="py-3 px-4 text-coisa-black">Teatro Sá de Miranda</td>
                <td className="py-3 px-4 text-coisa-black">12.50€</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    Confirmado
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-coisa-accent hover:text-coisa-accent/80">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-coisa-black">20 Fev 2025</td>
                <td className="py-3 px-4 text-coisa-black">Festival Rock do Minho</td>
                <td className="py-3 px-4 text-coisa-black">Parque da Cidade</td>
                <td className="py-3 px-4 text-coisa-black">25.00€</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    Confirmado
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-coisa-accent hover:text-coisa-accent/80">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderGallery = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-coisa-black">Gestão da Galeria</h3>
        <button className="btn-primary inline-flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Upload Imagem</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="card group">
            <div className="aspect-square bg-coisa-gray rounded-lg mb-3 flex items-center justify-center">
              <Camera className="w-12 h-12 text-coisa-black/50" />
            </div>
            <h4 className="font-semibold text-coisa-black mb-1">Imagem {item}</h4>
            <p className="text-coisa-black/70 text-sm mb-3">Categoria: Concert</p>
            <div className="flex space-x-2">
              <button className="flex-1 btn-secondary text-sm py-1">
                <Edit className="w-3 h-3 mr-1" />
                Editar
              </button>
              <button className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMerch = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-coisa-black">Gestão de Merchandising</h3>
        <button className="btn-primary inline-flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="card">
            <div className="aspect-square bg-coisa-gray rounded-lg mb-3 flex items-center justify-center">
              <Package className="w-12 h-12 text-coisa-black/50" />
            </div>
            <h4 className="font-semibold text-coisa-black mb-1">Produto {item}</h4>
            <p className="text-coisa-black/70 text-sm mb-3">Categoria: T-shirt</p>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-coisa-black">15.00€</span>
              <span className="text-sm text-green-600">25 em stock</span>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 btn-secondary text-sm py-1">
                <Edit className="w-3 h-3 mr-1" />
                Editar
              </button>
              <button className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-coisa-black">Gestão de Utilizadores</h3>
        <div className="text-sm text-coisa-black/70">
          Total: 156 utilizadores registados
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-coisa-gray/20">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Nome</th>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Função</th>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Registo</th>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-coisa-black">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coisa-gray/20">
              <tr>
                <td className="py-3 px-4 text-coisa-black">João Silva</td>
                <td className="py-3 px-4 text-coisa-black">joao@email.com</td>
                <td className="py-3 px-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    User
                  </span>
                </td>
                <td className="py-3 px-4 text-coisa-black">15 Nov 2024</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    Ativo
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-coisa-accent hover:text-coisa-accent/80">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-coisa-black">Admin</td>
                <td className="py-3 px-4 text-coisa-black">admin@coisamansa.pt</td>
                <td className="py-3 px-4">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                    Admin
                  </span>
                </td>
                <td className="py-3 px-4 text-coisa-black">01 Jan 2024</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    Ativo
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-coisa-accent hover:text-coisa-accent/80">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-coisa-black">Configurações do Sistema</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="font-bold text-coisa-black mb-4">Configurações Gerais</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-coisa-black mb-2">
                Nome da Banda
              </label>
              <input
                type="text"
                defaultValue="Coisa Mansa"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-coisa-black mb-2">
                Email de Contacto
              </label>
              <input
                type="email"
                defaultValue="info@coisamansa.pt"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-coisa-black mb-2">
                Localização
              </label>
              <input
                type="text"
                defaultValue="Viana do Castelo, Portugal"
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="font-bold text-coisa-black mb-4">Redes Sociais</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-coisa-black mb-2">
                Instagram
              </label>
              <input
                type="url"
                defaultValue="https://instagram.com/coisamansa"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-coisa-black mb-2">
                Facebook
              </label>
              <input
                type="url"
                defaultValue="https://facebook.com/coisamansa"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-coisa-black mb-2">
                YouTube
              </label>
              <input
                type="url"
                defaultValue="https://youtube.com/coisamansa"
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h4 className="font-bold text-coisa-black mb-4">Configurações de Email</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-coisa-black mb-2">
              Servidor SMTP
            </label>
            <input
              type="text"
              defaultValue="smtp.gmail.com"
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-coisa-black mb-2">
                Porta
              </label>
              <input
                type="number"
                defaultValue="587"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-coisa-black mb-2">
                Encriptação
              </label>
              <select className="input-field">
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary">
          Guardar Configurações
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'concerts':
        return renderConcerts();
      case 'gallery':
        return renderGallery();
      case 'merch':
        return renderMerch();
      case 'users':
        return renderUsers();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-coisa-gray/10">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-coisa-black mb-2">
              Painel de Administração
            </h1>
            <p className="text-coisa-black/70">
              Gestiona todo o conteúdo do website da Coisa Mansa
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <div className="card sticky top-24">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-coisa-accent text-white'
                          : 'text-coisa-black hover:bg-coisa-gray/20'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};