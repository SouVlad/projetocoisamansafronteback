import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Camera,
  FolderOpen,
  Package, 
  Newspaper,
  Users,
  Settings,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import clsx from 'clsx';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavigation = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Agenda', href: '/admin/agenda', icon: Calendar },
  { label: 'Galeria', href: '/admin/galeria', icon: Camera },
  { label: 'Álbuns', href: '/admin/albuns', icon: FolderOpen },
  { label: 'Merch', href: '/admin/merch', icon: Package },
  { label: 'Notícias', href: '/admin/noticias', icon: Newspaper },
  { label: 'Utilizadores', href: '/admin/utilizadores', icon: Users },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Verificar se o utilizador é admin ou owner
  if (!user || (user.role !== 'ADMIN' && user.role !== 'OWNER')) {
    return <Navigate to="/login" replace />;
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-coisa-gray/10">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed top-0 left-0 h-full w-64 bg-coisa-black border-r border-coisa-accent/20 z-50 transition-transform duration-300",
        "md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-coisa-accent/20">
            <div className="flex items-center justify-between mb-2">
              <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
                <div className="w-10 h-10 bg-coisa-white rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/logo.png" 
                    alt="Coisa Mansa" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-coisa-white font-bold text-lg">Coisa Mansa</span>
              </Link>
              {/* Close button - só visível em mobile */}
              <button
                onClick={closeMobileMenu}
                className="md:hidden text-coisa-white hover:text-coisa-accent"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-coisa-gray text-sm mt-2">Painel de Administração</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {adminNavigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeMobileMenu}
                className={clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive(item.href)
                    ? 'bg-coisa-accent text-white'
                    : 'text-coisa-gray hover:bg-coisa-accent/10 hover:text-coisa-accent'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-coisa-accent/20">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-4 py-3 text-coisa-gray hover:text-coisa-accent transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar ao Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-coisa-gray/30 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu - só visível em mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-coisa-black hover:text-coisa-accent"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-coisa-black">
                  {adminNavigation.find(item => isActive(item.href))?.label || 'Admin'}
                </h1>
                <p className="text-coisa-black/60 text-xs md:text-sm mt-1">
                  Bem-vindo, {user?.username}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 md:px-3 py-1 bg-coisa-accent/10 text-coisa-accent rounded-full text-xs md:text-sm font-medium">
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
