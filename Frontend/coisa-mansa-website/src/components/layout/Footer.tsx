import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-coisa-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-gradient-to-r from-coisa-accent/20 via-transparent to-coisa-accent/20" 
             style={{
               backgroundImage: `repeating-linear-gradient(
                 90deg,
                 transparent,
                 transparent 2px,
                 rgba(211, 54, 26, 0.3) 2px,
                 rgba(211, 54, 26, 0.3) 4px
               )`
             }}>
        </div>
      </div>

      <div className="relative border-t-2 border-coisa-accent">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Social Media */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-16 h-16 bg-coisa-white rounded-full flex items-center justify-center mb-4 overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Coisa Mansa" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-coisa-white font-bold text-xl mb-4">Coisa Mansa</h3>
              
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/coisa_mansa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-coisa-white rounded-full flex items-center justify-center text-coisa-white hover:bg-coisa-accent hover:border-coisa-accent transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/coisa.mansa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-coisa-white rounded-full flex items-center justify-center text-coisa-white hover:bg-coisa-accent hover:border-coisa-accent transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.youtube.com/@CoisaMansa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-coisa-white rounded-full flex items-center justify-center text-coisa-white hover:bg-coisa-accent hover:border-coisa-accent transition-all duration-300"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Contact Information */}
            <div className="text-center md:text-left">
              <h4 className="text-coisa-white font-bold text-lg mb-4">Contactos</h4>
              <div className="space-y-3">
                <a
                  href="mailto:"
                  className="flex items-center justify-center md:justify-start space-x-2 text-coisa-gray hover:text-coisa-accent transition-colors duration-200"
                >
                  <Mail className="w-4 h-4" />
                  <span>uma.coisa.mansa@gmail.com</span>
                </a>
                <a
                  href="https://linktr.ee/coisamansa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-coisa-gray hover:text-coisa-accent transition-colors duration-200"
                >
                  linktr.ee/coisamansa
                </a>
              </div>
            </div>

            {/* Useful Links */}
            <div className="text-center md:text-left">
              <h4 className="text-coisa-white font-bold text-lg mb-4">Links Úteis</h4>
              <div className="space-y-2">
                <Link
                  to="/termos"
                  className="block text-coisa-gray hover:text-coisa-accent transition-colors duration-200"
                >
                  Termos de Utilização
                </Link>
                <Link
                  to="/privacidade"
                  className="block text-coisa-gray hover:text-coisa-accent transition-colors duration-200"
                >
                  Política de Privacidade
                </Link>
                <Link
                  to="/cookies"
                  className="block text-coisa-gray hover:text-coisa-accent transition-colors duration-200"
                >
                  Política de Cookies
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-coisa-accent/20 mt-8 pt-8 text-center">
            <p className="text-coisa-gray text-sm">
              © {currentYear} Coisa Mansa. Todos os direitos reservados.
            </p>
            <p className="text-coisa-gray text-xs mt-2">
              Banda musical de Viana do Castelo • Rock • Fusão
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};