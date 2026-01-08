# 🚀 Como Iniciar o Projeto Coisa Mansa

## ✅ Conexão Frontend ↔️ Backend Configurada!

### 📋 Pré-requisitos
- Node.js instalado
- PostgreSQL a correr na porta 5432
- Base de dados `coisamansa` criada

---

## 🔧 Configuração Inicial (Apenas na primeira vez)

### 1. Backend
```bash
cd Backend
npm install
npm run prisma:generate
npm run prisma:migrate
```

### 2. Frontend
```bash
cd Frontend\coisa-mansa-website
npm install
```

---

## ▶️ Como Iniciar os Servidores

### Opção A: Dois Terminais Separados (Recomendado)

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```
✅ Backend estará disponível em: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd Frontend\coisa-mansa-website
npm run dev
```
✅ Frontend estará disponível em: http://localhost:5173

---

## 🔗 Configuração da Conexão

### Backend → Frontend
- **Ficheiro:** `Backend\.env`
- **Variável:** `FRONTEND_URL=http://localhost:5173`
- **CORS configurado em:** `Backend\src\index.js`

### Frontend → Backend
- **Ficheiro:** `Frontend\coisa-mansa-website\.env`
- **Variável:** `VITE_API_URL=http://localhost:3000/api`
- **Configurado em:** `Frontend\coisa-mansa-website\src\utils\api.ts`

---

## ✨ Testar a Conexão

1. Inicia ambos os servidores (Backend e Frontend)
2. Abre o navegador em http://localhost:5173
3. Testa o login ou registo de utilizador
4. Verifica a consola do navegador (F12) para ver os pedidos à API

---

## 🛠️ Resolução de Problemas

### Erro de CORS
- Verifica se o `FRONTEND_URL` no Backend está correto
- Verifica se o CORS está configurado em `Backend\src\index.js`

### Erro 404 nas chamadas à API
- Verifica se o Backend está a correr em http://localhost:3000
- Verifica se o `VITE_API_URL` no Frontend está correto
- Confirma que o endpoint existe no Backend

### Erro de Base de Dados
```bash
cd Backend
npm run prisma:migrate
```

---

## 📝 Estrutura dos Endpoints da API

Todos os endpoints começam com `/api`:

- **Auth:** `/api/auth/login`, `/api/auth/register`
- **Events:** `/api/events`
- **Merchandise:** `/api/merchandise`
- **Cart:** `/api/cart`
- **Payment:** `/api/payment`
- **Users:** `/api/users`

---

## 🎯 Portas Utilizadas

| Serviço    | Porta | URL                       |
|------------|-------|---------------------------|
| Frontend   | 5173  | http://localhost:5173     |
| Backend    | 3000  | http://localhost:3000     |
| PostgreSQL | 5432  | localhost:5432            |

---

## 📧 Suporte

Se tiveres problemas:
1. Verifica se ambos os servidores estão a correr
2. Verifica os ficheiros `.env` em ambas as pastas
3. Verifica a consola de ambos os servidores para erros
4. Limpa a cache do navegador e tenta novamente
