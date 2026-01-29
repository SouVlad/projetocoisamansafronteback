import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Camera, Package, Newspaper, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { eventsService } from '@/services/events.service';
import { merchService } from '@/services/merch.service';
import { newsService } from '@/services/news.service';
import { galleryService } from '@/services/gallery.service';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    events: 0,
    images: 0,
    products: 0,
    news: 0
  });
  const [recentActivity, setRecentActivity] = useState<Array<{
    text: string;
    time: string;
    color: string;
  }>>([]);

  useEffect(() => {
    loadStats();
    loadRecentActivity();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [events, images, products, news] = await Promise.all([
        eventsService.getAll().catch(() => []),
        galleryService.getAll().catch(() => []),
        merchService.getAll().catch(() => []),
        newsService.getAll().catch(() => [])
      ]);
      
      setStats({
        events: events.length,
        images: images.length,
        products: products.length,
        news: news.length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const [events, images, products, news] = await Promise.all([
        eventsService.getAll().catch(() => []),
        galleryService.getAll().catch(() => []),
        merchService.getAll().catch(() => []),
        newsService.getAll().catch(() => [])
      ]);

      const activities: Array<{ text: string; time: Date; color: string }> = [];

      // Adicionar eventos
      events.slice(0, 5).forEach((event: any) => {
        activities.push({
          text: `Evento "${event.title}" adicionado`,
          time: new Date(event.createdAt),
          color: 'bg-blue-500'
        });
      });

      // Adicionar imagens
      images.slice(0, 5).forEach((image: any) => {
        activities.push({
          text: `Imagem "${image.title}" carregada na galeria`,
          time: new Date(image.createdAt),
          color: 'bg-green-500'
        });
      });

      // Adicionar produtos
      products.slice(0, 5).forEach((product: any) => {
        activities.push({
          text: `Produto "${product.name}" ${product.stock === 0 ? 'esgotado' : 'adicionado'}`,
          time: new Date(product.createdAt),
          color: product.stock === 0 ? 'bg-orange-500' : 'bg-purple-500'
        });
      });

      // Adicionar notícias
      news.slice(0, 5).forEach((article: any) => {
        activities.push({
          text: `Notícia "${article.title}" publicada`,
          time: new Date(article.createdAt),
          color: 'bg-purple-500'
        });
      });

      // Ordenar por data (mais recentes primeiro) e pegar apenas os 5 mais recentes
      const sortedActivities = activities
        .sort((a, b) => b.time.getTime() - a.time.getTime())
        .slice(0, 5)
        .map(activity => ({
          text: activity.text,
          time: getRelativeTime(activity.time),
          color: activity.color
        }));

      setRecentActivity(sortedActivities);
    } catch (error) {
      console.error('Erro ao carregar atividade recente:', error);
    }
  };

  // Função para calcular tempo relativo
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return diffInMinutes <= 1 ? 'Há 1 minuto' : `Há ${diffInMinutes} minutos`;
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? 'Há 1 hora' : `Há ${diffInHours} horas`;
    } else if (diffInDays < 7) {
      return diffInDays === 1 ? 'Há 1 dia' : `Há ${diffInDays} dias`;
    } else {
      return date.toLocaleDateString('pt-PT');
    }
  };

  const statsCards = [
    { label: 'Eventos', value: stats.events.toString(), icon: Calendar, color: 'bg-blue-500', link: '/admin/agenda' },
    { label: 'Imagens', value: stats.images.toString(), icon: Camera, color: 'bg-green-500', link: '/admin/galeria' },
    { label: 'Produtos', value: stats.products.toString(), icon: Package, color: 'bg-purple-500', link: '/admin/merch' },
    { label: 'Notícias', value: stats.news.toString(), icon: Newspaper, color: 'bg-orange-500', link: '/admin/noticias' },
  ];

  const quickActions = [
    { 
      title: 'Criar Evento',
      description: 'Adiciona um novo concerto ou evento à agenda',
      icon: Calendar,
      color: 'bg-blue-500',
      link: '/admin/agenda'
    },
    { 
      title: 'Upload Imagem',
      description: 'Adiciona fotos à galeria da banda',
      icon: Camera,
      color: 'bg-green-500',
      link: '/admin/galeria'
    },
    { 
      title: 'Novo Produto',
      description: 'Adiciona merchandising à loja',
      icon: Package,
      color: 'bg-purple-500',
      link: '/admin/merch'
    },
    { 
      title: 'Publicar Notícia',
      description: 'Cria uma nova notícia sobre a banda',
      icon: Newspaper,
      color: 'bg-orange-500',
      link: '/admin/noticias'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card bg-gradient-to-r from-coisa-accent to-coisa-accent/80 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Bem-vindo ao Painel!</h2>
              <p className="text-white/90">
                Gere todo o conteúdo do site Coisa Mansa
              </p>
            </div>
            <TrendingUp className="w-16 h-16 opacity-50" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coisa-accent"></div>
              <p className="mt-4 text-coisa-black/60">A carregar estatísticas...</p>
            </div>
          ) : (
            statsCards.map((stat) => (
              <Link
                key={stat.label}
                to={stat.link}
                className="card hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-coisa-black/60 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-coisa-black mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} rounded-full p-3`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-2xl font-bold text-coisa-black mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.link}
                className="card hover:shadow-lg transition-all duration-200 group"
              >
                <div className={`${action.color} rounded-lg p-3 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-coisa-black mb-2 group-hover:text-coisa-accent transition-colors">
                  {action.title}
                </h4>
                <p className="text-coisa-black/70 text-sm mb-3">
                  {action.description}
                </p>
                <div className="flex items-center text-coisa-accent text-sm font-medium">
                  <span>Ir para página</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-xl font-bold text-coisa-black mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-center text-coisa-black/60 py-4">
                Nenhuma atividade recente
              </p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-coisa-gray/5 rounded-lg hover:bg-coisa-gray/10 transition-colors">
                  <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-coisa-black">{activity.text}</p>
                    <p className="text-coisa-black/60 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 rounded-full p-2 flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-coisa-black mb-1">Dica do Administrador</h4>
              <p className="text-coisa-black/70 text-sm">
                Mantém o conteúdo do site atualizado regularmente para manter os fãs envolvidos. 
                Publica notícias, adiciona fotos dos concertos e atualiza a agenda com novos eventos!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
