# 📖 ConstruManage — Documentação Técnica

## 1. Visão Geral da Arquitetura

A aplicação segue uma arquitetura **cliente-servidor desacoplada**, orquestrada por **Docker Compose**:

```
┌────────────────────────────────────────────────────────────────┐
│                   Docker Compose Network                       │
│                                                                │
│  ┌───────────────┐    ┌──────────────────┐    ┌─────────────┐ │
│  │   Frontend    │    │   Backend        │    │  PostgreSQL  │ │
│  │   React+Nginx │───►│   Django+Gunicorn│───►│  16-alpine   │ │
│  │   :80         │API │   :8000          │SQL │  :5432       │ │
│  └───────────────┘    └──────────────────┘    └─────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Serviços Docker

| Serviço | Imagem Base | Função | Porta |
|---------|-------------|--------|-------|
| `db` | `postgres:16-alpine` | Base de dados PostgreSQL | 5432 |
| `backend` | `python:3.12-slim` + Gunicorn | API REST + Admin | 8000 |
| `frontend` | `node:20-alpine` → `nginx:alpine` | SPA React + Reverse Proxy | 80 |

---

## 2. Configuração por Variáveis de Ambiente

Todas as configurações sensíveis são externalizadas via `.env`:

```
.env.example → copiar para .env → preenchido pelo developer
                                       ↓
docker-compose.yml (env_file: .env) → injecta nos containers
                                       ↓
Django settings.py (os.environ.get) → lê em runtime
```

**Ficheiro `.env`** nunca é incluído no Git (`.gitignore`). O `.env.example` serve como template.

---

## 3. Modelo de Dados

### Diagrama ER

```
┌────────────────┐     1   N    ┌────────────────────┐
│     Obra       │◄────────────►│     Transacao      │
│                │              │                    │
│ - nome         │              │ - descricao        │
│ - orcamento    │     1   N    │ - tipo (E/S)       │
│ - custo_atual  │◄────────────►│ - valor            │
│ - progresso    │              │ - categoria        │
│ - status       │              │ - data             │
│ - data_inicio  │              └────────────────────┘
│ - data_fim     │
│                │     1   N    ┌────────────────────┐
│                │◄────────────►│    Fornecedor      │
└────────────────┘              │                    │
                                │ - nome             │
                                │ - servico          │
┌────────────────────┐          │ - prazo_pagamento  │
│ PrevisaoFinanceira │          │ - valor            │
│                    │          │ - status_pagamento │
│ - mes              │          └────────────────────┘
│ - recebimentos     │
│ - pagamentos       │
└────────────────────┘
```

---

## 4. Autenticação JWT

### Fluxo

```
1. POST /api/auth/login/ {username, password}
   → Retorna {access, refresh}

2. Requests autenticadas:
   Header: Authorization: Bearer <access_token>

3. Refresh automático (Axios interceptor):
   POST /api/auth/refresh/ {refresh}
   → Novo {access, refresh}

4. Expiração total → redirect para /login
```

| Parâmetro | Default | Env Var |
|-----------|---------|---------|
| Access Token | 1 hora | `JWT_ACCESS_TOKEN_LIFETIME_HOURS` |
| Refresh Token | 7 dias | `JWT_REFRESH_TOKEN_LIFETIME_DAYS` |
| Rotate Refresh | Sim | — |

---

## 5. API REST — Referência

### Autenticação (públicos)

| Endpoint | Body | Response |
|----------|------|----------|
| `POST /api/auth/login/` | `{username, password}` | `{access, refresh}` |
| `POST /api/auth/refresh/` | `{refresh}` | `{access, refresh}` |
| `POST /api/auth/register/` | `{username, email, password, first_name, last_name}` | `{message, user}` |

### Dashboard

`GET /api/dashboard/` → `{receitas_mes, despesas_mes, saldo_atual, meses_data[], custos_categoria[], pagamentos_vencidos}`

### CRUD (autenticados)

| Recurso | List/Create | Detail |
|---------|-------------|--------|
| Obras | `GET/POST /api/obras/` | `GET/PUT/DELETE /api/obras/{id}/` |
| Transações | `GET/POST /api/transacoes/` | `GET/PUT/DELETE /api/transacoes/{id}/` |
| Fornecedores | `GET/POST /api/fornecedores/` | `GET/PUT/DELETE /api/fornecedores/{id}/` |
| Previsões | `GET/POST /api/previsoes/` | `GET/PUT/DELETE /api/previsoes/{id}/` |

---

## 6. Frontend — Componentes

```
App.jsx
├── /login → Login.jsx (JWT login form)
├── /register → Register.jsx (user registration)
└── /* (ProtectedRoute) → AppLayout
    ├── Sidebar.jsx (NavLink navigation)
    ├── TopHeader.jsx (search + user + logout)
    └── Routes:
        ├── / → Dashboard.jsx (BarChart + PieChart)
        ├── /orcamentos → Orcamentos.jsx (table + progress bars)
        ├── /fluxo-caixa → FluxoCaixa.jsx (form + table)
        ├── /fornecedores → Fornecedores.jsx (alerts + liquidate)
        └── /previsoes → Previsoes.jsx (AreaChart + risk analysis)
```

---

## 7. Docker — Detalhes

### Backend Dockerfile
- **Base:** `python:3.12-slim`
- Instala `gcc` + `libpq-dev` para psycopg2
- Copia código + instala requirements
- `collectstatic` para ficheiros estáticos do Django Admin
- Entrypoint: `entrypoint.sh` → aguarda PostgreSQL → migrations → seed → Gunicorn

### Frontend Dockerfile (Multi-stage)
- **Stage 1 (build):** `node:20-alpine` → `npm install` + `npm run build`
- **Stage 2 (serve):** `nginx:alpine` → copia `dist/` + `nginx.conf`
- Nginx atua como reverse proxy: `/api/` → `backend:8000`, `/*` → SPA

### Docker Compose
- **3 serviços:** `db`, `backend`, `frontend`
- PostgreSQL com `healthcheck` (o backend só inicia após DB estar saudável)
- Volumes nomeados: `postgres_data` (persistência DB), `static_files`

---

## 8. Como Estender

### Adicionar novo modelo
1. Definir em `backend/api/models.py`
2. Criar serializer em `serializers.py`
3. Criar ViewSet em `views.py`
4. Registar no router em `urls.py`
5. Registar em `admin.py`
6. `docker compose exec backend python manage.py makemigrations && docker compose exec backend python manage.py migrate`

### Adicionar nova página
1. Criar `frontend/src/pages/NovaPagina.jsx`
2. Rota em `App.jsx`
3. Link em `Sidebar.jsx`
4. Funções API em `api/api.js`
5. `docker compose up --build frontend`

---

## 9. Deploy em Produção

- Alterar `DJANGO_DEBUG=False` no `.env`
- Gerar `DJANGO_SECRET_KEY` segura
- Configurar `DJANGO_ALLOWED_HOSTS` com o domínio real
- Configurar HTTPS (cerbot + nginx ou cloud load balancer)
- Usar passwords fortes para PostgreSQL
- Restringir `CORS_ALLOWED_ORIGINS` ao domínio do frontend
