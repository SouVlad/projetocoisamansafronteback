import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Camera, Music, ArrowRight, Loader2, Newspaper, X, Volume2, VolumeX } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { newsService, NewsArticle } from '@/services/news.service';

export const HomePage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[10]}', '*');
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isMuted ? '{"event":"command","func":"unMute","args":""}' : '{"event":"command","func":"mute","args":""}';
      iframeRef.current.contentWindow.postMessage(command, '*');
      
      if (!isMuted) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[10]}', '*');
      }
      setIsMuted(!isMuted);
    }
  };

  const loadNews = async () => {
    try {
      setIsLoadingNews(true);
      const data = await newsService.getPublicArticles();
      setNews(data.slice(0, 3));
    } catch (err) {
      console.error('Erro ao carregar notícias:', err);
    } finally {
      setIsLoadingNews(false);
    }
  };

  return (
    <Layout>
      {}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {}
        <div className="absolute inset-0">
          <iframe
            ref={iframeRef}
            id="yt-player-home"
            className="absolute top-1/2 left-1/2 w-screen h-screen -translate-x-1/2 -translate-y-1/2"
            style={{
              minWidth: '100vw',
              minHeight: '100vh',
              width: 'calc(100vh * (16/9))',
              height: 'calc(100vw * (9/16))',
              pointerEvents: 'none'
            }}
            src="https://www.youtube.com/embed/B8SSEW3cGfk?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=B8SSEW3cGfk&enablejsapi=1"
            title="Background video"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-transparent" style={{ pointerEvents: 'none' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
          <button
            onClick={toggleMute}
            className="absolute bottom-8 right-8 z-20 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300"
            style={{ pointerEvents: 'auto' }}
            aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-coisa-black" />
            ) : (
              <Volume2 className="w-6 h-6 text-coisa-black" />
            )}
          </button>
        </div>

        {}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {}
          <div className="w-32 h-32 mx-auto mb-8 bg-coisa-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
            <img src="/logo.png" alt="Coisa Mansa" className="w-full h-full object-cover" />
          </div>

          {}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wide">
            COISA MANSA
          </h1>

          {}
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Banda de rock e fusão de Viana do Castelo, formada em 2022. 
            </p>
          </div>

          {}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/sobre"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
            >
              <span>Conhecer a Banda</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/agenda"
              className="btn-outline text-lg px-8 py-3 inline-flex items-center space-x-2 bg-white/10 border-white text-white hover:bg-white hover:text-coisa-black"
            >
              <Calendar className="w-5 h-5" />
              <span>Ver Agenda</span>
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-20 bg-coisa-gray/20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-coisa-black mb-4">
              Explora o nosso universo
            </h2>
            <p className="text-lg text-coisa-black/70 max-w-2xl mx-auto">
              Descobre tudo sobre a Coisa Mansa: desde os nossos concertos ao merchandising exclusivo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {}
            <Link 
              to="/agenda"
              className="group card hover:scale-105 transition-transform duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-coisa-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-coisa-black mb-2">Agenda</h3>
                <p className="text-coisa-black/70">
                  Não percas nenhum concerto. Vê a nossa agenda completa e reserva já os teus bilhetes.
                </p>
              </div>
            </Link>

            {}
            <Link 
              to="/galeria"
              className="group card hover:scale-105 transition-transform duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-coisa-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-coisa-black mb-2">Galeria</h3>
                <p className="text-coisa-black/70">
                  Fotografias dos nossos concertos, bastidores e momentos únicos da banda.
                </p>
              </div>
            </Link>

            {}
            <Link 
              to="/merch"
              className="group card hover:scale-105 transition-transform duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-coisa-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-coisa-black mb-2">Merch</h3>
                <p className="text-coisa-black/70">
                  T-shirts, álbuns, posters e muito mais. Leva um pedaço da Coisa Mansa contigo.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-coisa-black mb-4">
              Últimas notícias
            </h2>
            <p className="text-lg text-coisa-black/70">
              Mantém-te atualizado com tudo o que se passa na Coisa Mansa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingNews ? (
              <div className="col-span-full text-center py-8">
                <Loader2 className="w-12 h-12 text-coisa-accent mx-auto mb-4 animate-spin" />
                <p className="text-coisa-black/70">A carregar notícias...</p>
              </div>
            ) : news.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Newspaper className="w-12 h-12 text-coisa-black/30 mx-auto mb-4" />
                <p className="text-coisa-black/70">Ainda não há notícias publicadas.</p>
              </div>
            ) : (
              news.map((article) => (
                <div key={article.id} className="card">
                  <div className="aspect-video bg-coisa-gray rounded-lg mb-4 flex items-center justify-center">
                    <Newspaper className="w-12 h-12 text-coisa-black/50" />
                  </div>
                  <h3 className="text-xl font-bold text-coisa-black mb-2">
                    {article.title}
                  </h3>
                  <p className="text-coisa-black/70 mb-4">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-coisa-black/50">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('pt-PT')}
                    </span>
                    <button 
                      onClick={() => setSelectedNews(article)}
                      className="text-coisa-accent font-semibold hover:underline inline-flex items-center space-x-1"
                    >
                      <span>Ler mais</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-coisa-gray/30 p-6 flex items-start justify-between">
              <h2 className="text-3xl font-bold text-coisa-black pr-8">
                {selectedNews.title}
              </h2>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-2 text-coisa-black/60 hover:text-coisa-black hover:bg-coisa-gray/10 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6 text-sm text-coisa-black/60">
                <span>
                  {new Date(selectedNews.publishedAt || selectedNews.createdAt).toLocaleDateString('pt-PT', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {selectedNews.author && (
                  <>
                    <span>•</span>
                    <span>Por {selectedNews.author.username}</span>
                  </>
                )}
              </div>
              
              {selectedNews.summary && (
                <div className="mb-6 p-4 bg-coisa-accent/10 rounded-lg border-l-4 border-coisa-accent">
                  <p className="text-coisa-black/80 font-medium">{selectedNews.summary}</p>
                </div>
              )}
              
              <div className="prose prose-lg max-w-none text-coisa-black/80">
                {selectedNews.content.split('\n').map((paragraph, index) => {
                  if (!paragraph.trim()) return null;
                  return (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};