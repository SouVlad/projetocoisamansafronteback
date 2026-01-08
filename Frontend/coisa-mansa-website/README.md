# Coisa Mansa - Website da Banda

Website oficial da banda portuguesa Coisa Mansa de Viana do Castelo, desenvolvido em React com TypeScript.

## 🎵 Sobre a Banda

A Coisa Mansa é uma banda de rock e fusão de Viana do Castelo, formada em 2022. É composta por:
- **David Gigante** - Voz & Guitarra
- **Rafael Moreira** - Baixo
- **Tiago Esteves** - Bateria
- **Rodrigo Moreira** - Guitarra

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para styling
- **React Router** para navegação
- **Lucide React** para ícones
- **Context API** para gerenciamento de estado
- **Framer Motion** para animações

## 🚀 Funcionalidades

### Públicas
- **Homepage** com apresentação da banda
- **Sobre** - História e membros da banda
- **Agenda** - Concertos com sistema de lembretes por email
- **Galeria** - Fotografias dos concertos e bastidores
- **Merch** - Loja de produtos da banda
- **Contactos** - Formulário de contacto e informações

### Administrativas
- **Dashboard Admin** para gestão completa
- **Gestão de Concertos** - Adicionar, editar, remover
- **Gestão de Galeria** - Upload e organização de imagens
- **Gestão de Merchandising** - Produtos e stock
- **Gestão de Utilizadores**
- **Configurações do Sistema**

### Autenticação
- Sistema de login com diferentes tipos de utilizador
- **Admin**: Acesso total ao painel administrativo
- **User**: Acesso básico ao perfil

## 🔐 Credenciais de Demonstração

### Administrador
- **Email**: admin@coisamansa.pt
- **Password**: admin123

### Utilizador
- **Email**: user@coisamansa.pt
- **Password**: user123

## 📦 Instalação

1. **Clonar o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd coisa-mansa-website
   ```

2. **Instalar dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Iniciar servidor de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Aceder ao website**
   ```
   http://localhost:5173
   ```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── layout/         # Header, Footer, Layout
│   ├── ui/             # Componentes de UI
│   └── forms/          # Formulários
├── contexts/           # Contextos React (Auth)
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
│   ├── public/         # Páginas públicas
│   └── admin/          # Páginas administrativas
├── types/              # Definições TypeScript
├── utils/              # Funções utilitárias
├── styles/             # Estilos globais
└── assets/             # Recursos estáticos
```

## 🎨 Paleta de Cores

- **Preto**: #000000, #161616
- **Vermelho Terracota**: #D3361A (cor de destaque)
- **Rosa Salmão**: #EEAA9E
- **Cinza**: #DADADA
- **Branco**: #FFFFFF

## 📝 Scripts Disponíveis

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Verificar código com ESLint

## 🚀 Deploy

O projeto está configurado para deploy em qualquer plataforma que suporte SPAs:

1. **Build para produção**
   ```bash
   npm run build
   ```

2. **Os ficheiros de produção estarão na pasta `dist/`**

## 📱 Responsividade

O website é totalmente responsivo e otimizado para:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Funcionalidades Técnicas

### Email Automático
- Sistema de lembretes para concertos
- Newsletter subscription
- Formulários de contacto com envio automático

### Upload de Ficheiros
- Upload de imagens para a galeria (Admin)
- Gestão de produtos com imagens

### Autenticação
- Context API para gerenciamento de estado
- Roteamento protegido
- Diferentes níveis de acesso

## 🎯 Roadmap Futuro

- [ ] Integração com backend real
- [ ] Sistema de pagamentos online
- [ ] Player de música integrado
- [ ] Sistema de comentários
- [ ] Newsletter automática
- [ ] Integração com redes sociais
- [ ] App móvel

## 🤝 Contribuição

Este é um projeto privado da banda Coisa Mansa. Para questões ou sugestões, contacte a banda através dos canais oficiais.

## 📄 Licença

Todos os direitos reservados © 2024 Coisa Mansa.

---

**Desenvolvido com ❤️ para a banda Coisa Mansa**