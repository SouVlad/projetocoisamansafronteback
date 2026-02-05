import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Users, Music, Volume2, VolumeX } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

export const AboutPage: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const bandMembers = [
    {
      name: 'David Gigante',
      role: 'Guitarra',
      image: '/images/members/foto_david.png'
    },
    {
      name: 'Rafael Moreira',
      role: 'Sintetizador',
      image: '/images/members/foto_rafael.png'
    },
    {
      name: 'Tiago Esteves',
      role: 'Bateria',
      image: '/images/members/foto_esteves.png'
    },
    {
      name: 'Rodrigo Moreira',
      role: 'Baixo',
      image: '/images/members/foto_rodrigo.png'
    }
  ];

  return (
    <Layout>
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <iframe
            ref={iframeRef}
            id="yt-player-about"
            className="absolute top-1/2 left-1/2 w-screen h-screen -translate-x-1/2 -translate-y-1/2"
            style={{
              minWidth: '100vw',
              minHeight: '100vh',
              width: 'calc(100vh * (16/9))',
              height: 'calc(100vw * (9/16))',
              pointerEvents: 'none'
            }}
            src="https://www.youtube.com/embed/NgmmPIk_1LE?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=NgmmPIk_1LE&enablejsapi=1"
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

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wide">
            SOBRE NÓS
          </h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-coisa-black mb-6">
                A Nossa História
              </h2>
              <div className="w-24 h-1 bg-coisa-accent mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-coisa-black/80 leading-relaxed mb-6">
                  A banda Coisa Mansa é constituída por David Gigante (guitarra elétrica), Rafael
                  Moreira (sintetizador), Tiago Esteves (bateria) e Rodrigo Moreira (baixo elétrico). Desde 2022 que criam temas originais, instrumentais. Com diferentes estéticas e
                  referências, viajam pelo caminho do rock, fusão e outros lugares difíceis de definir
                  ainda, tocam aquilo que os prende à música.
                </p>
                <p className="text-lg text-coisa-black/80 leading-relaxed mb-6">
                  Desde 2022 que tem tocado em diferentes palcos como na Casa da Música, Viana
                  Rock Fest, e Incode Fest, numa forte vontade de levar as suas criações a diferentes
                  públicos. Fazem parte da editora/produtora Sons Fantasma, junto com as bandas
                  Mr.Miyagi e Puto.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-coisa-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-coisa-black mb-1">Formação</h3>
                    <p className="text-coisa-black/70">Estabelecida em 2022 em Viana do Castelo</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-coisa-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-coisa-black mb-1">Origem</h3>
                    <p className="text-coisa-black/70">Viana do Castelo, Portugal</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-coisa-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-coisa-black mb-1">Género</h3>
                    <p className="text-coisa-black/70">Rock-Fusão</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-coisa-gray/10">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-coisa-black mb-6">
              Os Membros
            </h2>
            <p className="text-lg text-coisa-black/70 max-w-2xl mx-auto">
              Quatro talentos únicos que se uniram para criar o som característico da Coisa Mansa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bandMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300 ring-4 ring-coisa-gray group-hover:ring-coisa-accent">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-coisa-gray hidden items-center justify-center">
                    <Users className="w-16 h-16 text-coisa-black" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-coisa-black mb-2">{member.name}</h3>
                <p className="text-coisa-accent font-semibold mb-3">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-coisa-black text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Vem connosco nesta jornada
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Acompanho a nossa música, noticia-se dos nossos concertos e faz parte da família Coisa Mansa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/agenda"
              className="btn-primary text-lg px-8 py-3"
            >
              Ver Próximos Concertos
            </a>
            <a
              href="/contactos"
              className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-coisa-black"
            >
              Contactar a Banda
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};