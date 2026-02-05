import React, { useState } from 'react';
import { Mail, Clock, Send, Instagram, Facebook, Youtube } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ContactFormData } from '@/types';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectOptions = [
    'Informações Gerais',
    'Reserva de Bilhetes',
    'Parcerias Musicais',
    'Imprensa e Media',
    'Booking e Concertos',
    'Sugestões',
    'Outro'
  ];

  return (
    <Layout>
      {}
      <section className="py-20 bg-gradient-to-br from-coisa-black to-coisa-black-light text-white">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contactos</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Tens alguma pergunta, sugestão ou quer marcar um concerto? Fala connosco!
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {}
            <div>
              <h2 className="text-4xl font-bold text-coisa-black mb-8">
                Vamos conversar
              </h2>
              
              <div className="space-y-8">
                {}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-coisa-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-coisa-black mb-2">Email</h3>
                    <p className="text-coisa-black/70 mb-2">
                      Para questões gerais e informações
                    </p>
                    <a 
                      href="mailto:uma.coisa.mansa@gmail.com"
                      className="text-coisa-accent font-semibold hover:underline"
                    >
                      uma.coisa.mansa@gmail.com
                    </a>
                  </div>
                </div>

                {}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-coisa-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-coisa-black mb-2">Tempo de Resposta</h3>
                    <p className="text-coisa-black/70">
                      Respondemos a todos os emails em 24-48 horas
                    </p>
                  </div>
                </div>
              </div>

              {}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-coisa-black mb-6">
                  Segue-nos nas redes sociais
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com/coisa_mansa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a
                    href="https://facebook.com/coisa.mansa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.youtube.com/@CoisaMansa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
                  >
                    <Youtube className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {}
            <div>
              <div className="bg-coisa-gray/10 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-coisa-black mb-6">
                  Envia-nos uma mensagem
                </h2>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg">
                    <p className="text-green-800">
                      Mensagem enviada com sucesso! Responderemos em breve.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg">
                    <p className="text-red-800">
                      Erro ao enviar mensagem. Por favor, tenta novamente.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-coisa-black mb-2">
                        Nome *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="O teu nome"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-coisa-black mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="o.teu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-coisa-black mb-2">
                      Assunto *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Seleciona um assunto</option>
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-coisa-black mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="input-field"
                      placeholder="Escreve aqui a tua mensagem..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>A enviar...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Enviar Mensagem</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-coisa-black/60">
                    Ao enviar esta mensagem, concordas com a nossa{' '}
                    <a href="/privacidade" className="text-coisa-accent hover:underline">
                      Política de Privacidade
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};