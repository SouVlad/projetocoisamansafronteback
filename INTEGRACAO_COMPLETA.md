# ✅ Integração Frontend ↔️ Backend - COMPLETA

## 🎯 O que foi feito:

### 1. **Tipos TypeScript Atualizados** ([Frontend/coisa-mansa-website/src/types/index.ts](Frontend/coisa-mansa-website/src/types/index.ts))

Todos os tipos agora correspondem **exatamente** aos modelos do backend:

```typescript
// ✅ User - corresponde ao modelo Prisma
interface User {
  id: number;              // era string
  username: string;        // era name
  role: 'ADMIN' | 'USER'; // corresponde ao enum do backend
  superAdmin?: boolean;   // campo do backend
}

// ✅ Event - novo tipo baseado no backend
interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  startsAt: string;       // formato ISO 8601
  endsAt?: string;
  isPublic: boolean;
  createdById: number;
}

// ✅ MerchItem - corresponde ao backend
interface MerchItem {
  id: number;             // era string
  name: string;
  price: number;
  stock: number;
  available: boolean;
}
```

---

### 2. **Serviços Atualizados para Endpoints Reais**

#### 📅 **Events Service** ([events.service.ts](Frontend/coisa-mansa-website/src/services/events.service.ts))

```typescript
// ✅ Endpoints corretos do backend
GET    /api/events          → Lista eventos
GET    /api/events/:id      → Busca evento
POST   /api/events          → Cria evento (ADMIN)
PUT    /api/events/:id      → Atualiza evento (ADMIN)
DELETE /api/events/:id      → Remove evento (ADMIN)

// ✅ IDs agora são numbers
eventsService.getById(8)     // não mais string
eventsService.delete(8)

// ✅ Formato de data correto
createEvent({
  title: "Concerto",
  startsAt: "2026-02-15T20:00:00Z",  // ISO 8601
  isPublic: true
})
```

#### 🛍️ **Merchandise Service** ([merch.service.ts](Frontend/coisa-mansa-website/src/services/merch.service.ts))

```typescript
// ✅ Endpoints corretos do backend
GET    /api/merchandise       → Lista produtos
POST   /api/merchandise       → Cria produto (ADMIN)
PUT    /api/merchandise/:id   → Atualiza produto (ADMIN)
DELETE /api/merchandise/:id   → Remove produto (ADMIN)

// ✅ Removido: upload de imagens, update stock (não existe no backend)
// ✅ IDs são numbers
merchService.getById(5)
```

#### 🔐 **Auth Service** ([auth.service.ts](Frontend/coisa-mansa-website/src/services/auth.service.ts))

```typescript
// ✅ Registro atualizado
register({
  username: "João",    // era "name"
  email: "...",
  password: "..."
})

// ✅ Response do backend
{
  token: "jwt...",
  user: {
    id: 1,
    username: "João",
    email: "...",
    role: "USER"
  }
}
```

---

### 3. **Auth Context Atualizado** ([AuthContext.tsx](Frontend/coisa-mansa-website/src/contexts/AuthContext.tsx))

```typescript
// ✅ Nova propriedade isAdmin
const { user, isAuthenticated, isAdmin } = useAuth();

// Verifica se é admin
if (isAdmin) {
  // user.role === 'ADMIN' || user.superAdmin === true
}
```

---

## 🔗 Mapeamento Completo de Endpoints

### Backend → Frontend

| Backend Endpoint | Frontend Service | Método |
|-----------------|------------------|--------|
| `POST /auth/login` | `authService.login()` | ✅ |
| `POST /auth/register` | `authService.register()` | ✅ |
| `GET /api/events` | `eventsService.getAll()` | ✅ |
| `POST /api/events` | `eventsService.create()` | ✅ |
| `PUT /api/events/:id` | `eventsService.update()` | ✅ |
| `DELETE /api/events/:id` | `eventsService.delete()` | ✅ |
| `GET /api/merchandise` | `merchService.getAll()` | ✅ |
| `POST /api/merchandise` | `merchService.create()` | ✅ |
| `PUT /api/merchandise/:id` | `merchService.update()` | ✅ |
| `DELETE /api/merchandise/:id` | `merchService.delete()` | ✅ |

---

## 🗑️ Dados Mock Removidos

✅ Todos os tipos antigos foram substituídos pelos reais do backend  
✅ Interfaces antigas removidas (Product, Concert antigo)  
✅ Campos inexistentes removidos (sizes, colors, category em merch)  
✅ Métodos não implementados no backend removidos  

---

## 🚀 Como Usar no Frontend

### Exemplo: Listar Eventos

```typescript
import { eventsService } from '@/services/events.service';
import { Event } from '@/types';

function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await eventsService.getAll();
        setEvents(data);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    }
    loadEvents();
  }, []);

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.location}</p>
          <p>{new Date(event.startsAt).toLocaleString('pt-PT')}</p>
        </div>
      ))}
    </div>
  );
}
```

### Exemplo: Criar Evento (Admin)

```typescript
import { eventsService } from '@/services/events.service';
import { useAuth } from '@/contexts/AuthContext';

function CreateEventForm() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return <p>Acesso negado</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      await eventsService.create({
        title: "Concerto no Porto",
        description: "Grande concerto!",
        location: "Casa da Música",
        startsAt: "2026-03-15T20:00:00Z",
        isPublic: true
      });
      
      alert('Evento criado! Emails enviados automaticamente.');
    } catch (error) {
      alert('Erro ao criar evento');
    }
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Exemplo: Listar Produtos

```typescript
import { merchService } from '@/services/merch.service';
import { MerchItem } from '@/types';

function ProductsList() {
  const [products, setProducts] = useState<MerchItem[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await merchService.getAvailable(); // apenas disponíveis
      setProducts(data);
    }
    loadProducts();
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>€{product.price.toFixed(2)}</p>
          <p>Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## ⚙️ Configuração

### Backend (.env)
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🧪 Testar Integração

1. **Inicia o Backend:**
```bash
cd Backend
npm run dev
```

2. **Inicia o Frontend:**
```bash
cd Frontend/coisa-mansa-website
npm run dev
```

3. **Testa no navegador:**
- http://localhost:5173
- Regista um utilizador
- Faz login
- Vê eventos e produtos do backend real!

---

## ✨ Benefícios

✅ **Type Safety Completo** - TypeScript com tipos corretos  
✅ **Sem Dados Mock** - Tudo vem do backend real  
✅ **IDs Corretos** - Numbers em vez de strings  
✅ **Datas Corretas** - Formato ISO 8601  
✅ **Auth Completo** - Login/Register funcionando  
✅ **CRUD Completo** - Criar, ler, atualizar, deletar  
✅ **Admin Check** - Verifica permissões corretamente  

---

## 🎉 Próximos Passos

Agora podes:
1. Criar páginas/componentes que usam estes serviços
2. Implementar forms de criação/edição
3. Adicionar validações
4. Melhorar UI/UX
5. Tudo já está conectado ao backend real!
