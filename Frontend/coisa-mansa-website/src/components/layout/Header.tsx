import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import clsx from 'clsx';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { label: 'Sobre', href: '/sobre' },
  { 
    label: 'Explore', 
    href: '/explore',
    children: [
      { label: 'Agenda', href: '/agenda' },
      { label: 'Galeria', href: '/galeria' }
    ]
  },
  { label: 'Merch', href: '/merch' },
  { label: 'Contactos', href: '/contactos' },
];

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (href: string) => {
    if (href === '/explore') {
      return location.pathname.startsWith('/agenda') || location.pathname.startsWith('/galeria');
    }
    return location.pathname === href;
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-coisa-black/95 backdrop-blur-sm border-b border-coisa-accent/20">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-coisa-white flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Coisa Mansa" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-coisa-white font-bold text-lg hidden sm:block">
              Coisa Mansa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.href} className="relative group">
                {item.children ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsExploreOpen(true)}
                    onMouseLeave={() => setIsExploreOpen(false)}
                  >
                    <Link
                      to={item.href}
                      className={clsx(
                        'flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200',
                        isActive(item.href)
                          ? 'text-coisa-accent'
                          : 'text-coisa-white hover:text-coisa-accent'
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Link>
                    
                    {/* Dropdown Menu */}
                    {isExploreOpen && (
                      <div className="absolute top-full left-0 pt-2 w-48">
                        <div className="bg-coisa-black-light border border-coisa-accent/20 rounded-lg shadow-xl">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className={clsx(
                                'block px-4 py-3 text-sm transition-colors duration-200',
                                isActive(child.href)
                                  ? 'text-coisa-accent bg-coisa-accent/10'
                                  : 'text-coisa-white hover:text-coisa-accent hover:bg-coisa-accent/5'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={clsx(
                      'px-3 py-2 text-sm font-medium transition-colors duration-200',
                      isActive(item.href)
                        ? 'text-coisa-accent'
                        : 'text-coisa-white hover:text-coisa-accent'
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-coisa-white hover:text-coisa-accent transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user?.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-coisa-black-light border border-coisa-accent/20 rounded-lg shadow-xl">
                    <Link
                      to="/perfil"
                      className="block px-4 py-3 text-sm text-coisa-white hover:text-coisa-accent hover:bg-coisa-accent/5 transition-colors duration-200"
                    >
                      Meu Perfil
                    </Link>
                    {(user?.role === 'ADMIN' || user?.role === 'OWNER') && (
                      <Link
                        to="/admin"
                        className="block px-4 py-3 text-sm text-coisa-white hover:text-coisa-accent hover:bg-coisa-accent/5 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Painel de Administração
                      </Link>
                    )}
                    <hr className="border-coisa-accent/20" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-3 text-sm text-coisa-white hover:text-coisa-accent hover:bg-coisa-accent/5 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-coisa-white hover:text-coisa-accent transition-colors duration-200"
                >
                  Entrar
                </Link>
                <span className="text-coisa-gray">|</span>
                <Link
                  to="/register"
                  className="text-coisa-white hover:text-coisa-accent transition-colors duration-200"
                >
                  Registar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-coisa-white hover:text-coisa-accent transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-coisa-black-light border-t border-coisa-accent/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.href}>
                  <Link
                    to={item.href}
                    className={clsx(
                      'block px-3 py-2 text-base font-medium transition-colors duration-200',
                      isActive(item.href)
                        ? 'text-coisa-accent'
                        : 'text-coisa-white hover:text-coisa-accent hover:bg-coisa-accent/5'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={clsx(
                            'block px-3 py-2 text-sm transition-colors duration-200',
                            isActive(child.href)
                              ? 'text-coisa-accent'
                              : 'text-coisa-gray hover:text-coisa-accent'
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile User Menu */}
              <hr className="border-coisa-accent/20 my-2" />
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm text-coisa-gray">
                    Olá, {user?.username}
                  </div>
                  <Link
                    to="/perfil"
                    className="block px-3 py-2 text-base text-coisa-white hover:text-coisa-accent hover:bg-coisa-accent/5 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                  {(user?.role === 'ADMIN' || user?.role === 'OWNER') && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-base text-coisa-white hover:text-coisa-accent hover:bg-coisa-accent/5 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Painel de Administração
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-base text-coisa-white hover:text-coisa-accent hover:bg-coisa-accent/5 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base text-coisa-white hover:text-coisa-accent hover:bg-coisa-accent/5 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base text-coisa-white hover:text-coisa-accent hover:bg-coisa-accent/5 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Registar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};