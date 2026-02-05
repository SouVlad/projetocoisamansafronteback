import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Email ou password incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tenta novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {}
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
              <img src="/logo.png" alt="Coisa Mansa" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-4xl font-bold text-coisa-black mb-2">
              Entrar
            </h2>
            <p className="text-coisa-black/70">
              Acede à tua conta para gerir o teu perfil e conteúdos
            </p>
          </div>

          {}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-coisa-gray">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {successMessage && (
                <div className="bg-green-100 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-800 text-sm">{successMessage}</span>
                </div>
              )}
              
              {error && (
                <div className="bg-red-100 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-coisa-black mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-coisa-gray" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="o.teu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-coisa-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-coisa-gray" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="A tua password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-coisa-gray hover:text-coisa-black" />
                    ) : (
                      <Eye className="h-5 w-5 text-coisa-gray hover:text-coisa-black" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-coisa-accent focus:ring-coisa-accent border-coisa-gray rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-coisa-black">
                    Lembrar-me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-coisa-accent hover:text-coisa-accent/80"
                  >
                    Esqueci a password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>A entrar...</span>
                  </>
                ) : (
                  <span>Entrar</span>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-coisa-gray" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-coisa-black/60">
                    Ou
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-coisa-black/70">
                  Não tens uma conta?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-coisa-accent hover:text-coisa-accent/80"
                  >
                    Regista-te aqui
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {}
          <div className="text-center">
            <p className="text-sm text-coisa-black/60">
              Ao entrares, concordas com os nossos{' '}
              <a href="/termos" className="text-coisa-accent hover:underline">
                Termos de Utilização
              </a>{' '}
              e{' '}
              <a href="/privacidade" className="text-coisa-accent hover:underline">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};