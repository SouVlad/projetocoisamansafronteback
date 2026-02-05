import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { authService } from '@/services/auth.service';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      setError('Por favor, insere o teu nome');
      return false;
    }
    if (!email.trim()) {
      setError('Por favor, insere o teu email');
      return false;
    }
    if (password.length < 6) {
      setError('A password deve ter pelo menos 6 caracteres');
      return false;
    }
    if (password !== confirmPassword) {
      setError('As passwords não coincidem');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({ username: name, email, password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registar. Tenta novamente.');
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
              Criar Conta
            </h2>
            <p className="text-coisa-black/70">
              Junta-te à comunidade Coisa Mansa
            </p>
          </div>

          {}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-coisa-gray">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-800 text-sm">
                    Conta criada com sucesso! A redirecionar...
                  </span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-coisa-black mb-2">
                  Nome
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-coisa-gray" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="O teu nome"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Mínimo 6 caracteres"
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

              <div>
                <label className="block text-sm font-semibold text-coisa-black mb-2">
                  Confirmar Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-coisa-gray" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="Confirma a tua password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-coisa-gray hover:text-coisa-black" />
                    ) : (
                      <Eye className="h-5 w-5 text-coisa-gray hover:text-coisa-black" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-coisa-accent focus:ring-coisa-accent border-coisa-gray rounded"
                    required
                  />
                </div>
                <label htmlFor="terms" className="ml-2 block text-sm text-coisa-black">
                  Concordo com os{' '}
                  <a href="/termos" className="text-coisa-accent hover:underline">
                    Termos de Utilização
                  </a>{' '}
                  e{' '}
                  <a href="/privacidade" className="text-coisa-accent hover:underline">
                    Política de Privacidade
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>A criar conta...</span>
                  </>
                ) : (
                  <span>Criar Conta</span>
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
                  Já tens uma conta?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-coisa-accent hover:text-coisa-accent/80"
                  >
                    Entra aqui
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {}
          <div className="bg-coisa-gray/20 border border-coisa-accent/20 rounded-lg p-4">
            <h3 className="font-bold text-coisa-black mb-2 text-sm">Requisitos da Password:</h3>
            <ul className="space-y-1 text-sm text-coisa-black/70">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Mínimo de 6 caracteres
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Recomendado: combinar letras, números e símbolos
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};
