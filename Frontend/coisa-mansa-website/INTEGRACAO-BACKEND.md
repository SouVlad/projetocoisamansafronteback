# 🔌 Guia de Conexão Frontend-Backend

## 📝 Configuração Inicial

### 1. Configurar URL do Backend

Edite o arquivo `.env` na raiz do projeto `coisa-mansa-website/`:

```env
VITE_API_URL=http://localhost:3000/api
```

**Nota:** Em produção, altere para a URL do seu backend real:
```env
VITE_API_URL=https://api.coisamansa.pt/api
```

### 2. Estrutura Criada

```
src/
├── services/           # Serviços de API
│   ├── auth.service.ts    # Autenticação
│   ├── events.service.ts  # Eventos/Agenda
│   ├── gallery.service.ts # Galeria
│   ├── contact.service.ts # Contato
│   └── merch.service.ts   # Merchandise
├── utils/
│   └── api.ts          # Cliente HTTP centralizado
└── contexts/
    └── AuthContext.tsx # Atualizado para usar API real
```

---

## 🚀 Como Usar os Serviços

### 1. **Autenticação**

```tsx
import { authService } from '@/services/auth.service';

// Login
const handleLogin = async () => {
  try {
    const response = await authService.login({
      email: 'user@example.com',
      password: 'senha123'
    });
    console.log('Usuário logado:', response.user);
  } catch (error) {
    console.error('Erro no login:', error);
  }
};

// Logout
const handleLogout = async () => {
  await authService.logout();
};

// Verificar token
const checkUser = async () => {
  try {
    const user = await authService.verifyToken();
    console.log('Usuário autenticado:', user);
  } catch (error) {
    console.error('Token inválido');
  }
};
```

### 2. **Eventos (Agenda)**

```tsx
import { eventsService } from '@/services/events.service';

// Listar eventos futuros
const loadEvents = async () => {
  try {
    const events = await eventsService.getUpcoming();
    console.log('Eventos:', events);
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  }
};

// Criar novo evento (admin)
const createEvent = async () => {
  try {
    const newEvent = await eventsService.create({
      title: 'Show ao vivo',
      description: 'Concerto especial',
      date: '2026-02-15',
      time: '21:00',
      location: 'Lisboa',
      venue: 'Coliseu',
      price: 15
    });
    console.log('Evento criado:', newEvent);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
  }
};

// Upload de imagem do evento
const uploadEventImage = async (eventId: string, file: File) => {
  try {
    const updatedEvent = await eventsService.uploadImage(eventId, file);
    console.log('Imagem atualizada:', updatedEvent);
  } catch (error) {
    console.error('Erro no upload:', error);
  }
};
```

### 3. **Galeria**

```tsx
import { galleryService } from '@/services/gallery.service';

// Listar todas as fotos
const loadGallery = async () => {
  try {
    const images = await galleryService.getAll();
    console.log('Imagens:', images);
  } catch (error) {
    console.error('Erro ao carregar galeria:', error);
  }
};

// Upload de nova foto (admin)
const uploadPhoto = async (file: File) => {
  try {
    const newImage = await galleryService.upload(file, {
      title: 'Show em Lisboa',
      category: 'concerts'
    });
    console.log('Foto adicionada:', newImage);
  } catch (error) {
    console.error('Erro no upload:', error);
  }
};
```

### 4. **Contato**

```tsx
import { contactService } from '@/services/contact.service';

// Enviar mensagem de contato
const sendMessage = async () => {
  try {
    await contactService.send({
      name: 'João Silva',
      email: 'joao@example.com',
      subject: 'Booking',
      message: 'Gostaria de agendar um show...'
    });
    alert('Mensagem enviada com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
};

// Listar mensagens (admin)
const loadMessages = async () => {
  try {
    const messages = await contactService.getAll();
    console.log('Mensagens:', messages);
  } catch (error) {
    console.error('Erro ao carregar mensagens:', error);
  }
};
```

### 5. **Merchandise**

```tsx
import { merchService } from '@/services/merch.service';

// Listar produtos disponíveis
const loadProducts = async () => {
  try {
    const products = await merchService.getAll(true); // apenas disponíveis
    console.log('Produtos:', products);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
};

// Criar novo produto (admin)
const createProduct = async () => {
  try {
    const newProduct = await merchService.create({
      name: 'T-shirt Coisa Mansa',
      description: 'Camiseta oficial',
      price: 20,
      stock: 50,
      available: true,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Preto', 'Branco']
    });
    console.log('Produto criado:', newProduct);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
  }
};
```

---

## 🎯 Uso em Componentes React

### Exemplo: Componente de Login

```tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    
    if (!success) {
      setError('Email ou password incorretos');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};
```

### Exemplo: Componente de Lista de Eventos

```tsx
import React, { useEffect, useState } from 'react';
import { eventsService, Event } from '@/services/events.service';

export const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getUpcoming();
      setEvents(data);
    } catch (err) {
      setError('Erro ao carregar eventos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.date} - {event.location}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 🔐 Tratamento de Erros

Todos os serviços retornam erros estruturados:

```tsx
import { ApiError } from '@/utils/api';

try {
  await authService.login({ email, password });
} catch (error) {
  const apiError = error as ApiError;
  
  console.error('Mensagem:', apiError.message);
  console.error('Status:', apiError.status);
  
  // Erros de validação (se houver)
  if (apiError.errors) {
    console.error('Erros de validação:', apiError.errors);
  }
}
```

---

## 🌐 Requisitos do Backend

Para que a integração funcione, o backend deve ter os seguintes endpoints:

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Verificar token
- `POST /api/auth/forgot-password` - Solicitar reset de senha
- `POST /api/auth/reset-password` - Resetar senha
- `PUT /api/auth/profile` - Atualizar perfil
- `POST /api/auth/change-password` - Alterar senha

### Eventos
- `GET /api/events` - Listar eventos
- `GET /api/events/:id` - Buscar evento
- `POST /api/events` - Criar evento
- `PUT /api/events/:id` - Atualizar evento
- `DELETE /api/events/:id` - Remover evento
- `POST /api/events/:id/image` - Upload de imagem

### Galeria
- `GET /api/gallery` - Listar fotos
- `GET /api/gallery/:id` - Buscar foto
- `POST /api/gallery` - Upload de foto
- `PUT /api/gallery/:id` - Atualizar foto
- `DELETE /api/gallery/:id` - Remover foto
- `POST /api/gallery/reorder` - Reordenar fotos

### Contato
- `POST /api/contact` - Enviar mensagem
- `GET /api/contact` - Listar mensagens (admin)
- `GET /api/contact/:id` - Buscar mensagem (admin)
- `PATCH /api/contact/:id/read` - Marcar como lida (admin)
- `DELETE /api/contact/:id` - Remover mensagem (admin)

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/:id` - Atualizar produto (admin)
- `DELETE /api/products/:id` - Remover produto (admin)
- `POST /api/products/:id/image` - Upload de imagem (admin)
- `PATCH /api/products/:id/stock` - Atualizar stock (admin)

---

## 🔧 CORS no Backend

Certifique-se de que o backend permite requisições do frontend. Exemplo em Express.js:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend
  credentials: true
}));
```

---

## ✅ Checklist de Integração

- [ ] `.env` configurado com URL do backend
- [ ] Backend rodando e acessível
- [ ] CORS configurado no backend
- [ ] Endpoints do backend criados
- [ ] Token JWT sendo retornado no login
- [ ] Autenticação Bearer token funcionando
- [ ] Testar login/logout
- [ ] Testar endpoints protegidos
- [ ] Tratamento de erros implementado

---

## 📦 Próximos Passos

1. **Iniciar o backend** na porta 3000 (ou ajustar `.env`)
2. **Testar login** com credenciais válidas
3. **Implementar páginas** que usam os serviços
4. **Adicionar loading states** nos componentes
5. **Implementar tratamento de erros** global
6. **Adicionar refresh token** (opcional)
7. **Configurar variáveis de ambiente** para produção

---

## 🆘 Troubleshooting

### Erro de CORS
- Verificar se CORS está configurado no backend
- Verificar se a URL do backend está correta

### Token inválido
- Verificar se o token está sendo salvo corretamente
- Verificar se o backend aceita token Bearer

### Erro de conexão
- Verificar se o backend está rodando
- Verificar a URL no `.env`
- Ver console do navegador para detalhes

### Endpoints não encontrados (404)
- Verificar se os endpoints existem no backend
- Verificar se a URL base está correta
- Verificar se há `/api` no caminho

---

## 📚 Recursos Adicionais

- Documentação do Vite: https://vitejs.dev/
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- JWT: https://jwt.io/

---

✨ **Pronto!** Agora o frontend está preparado para se conectar ao backend.
