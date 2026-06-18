# ðŸ—ï¸ ConstruManage â€” Plataforma de GestÃ£o Financeira para ConstruÃ§Ã£o Civil

<p align="center">
  <strong>Plataforma web completa para gestÃ£o financeira integrada de empresas de construÃ§Ã£o civil.</strong><br>
  Desenvolvido no Ã¢mbito do Projeto de 3Âº Ano â€” Licenciatura em Tecnologias Digitais e GestÃ£o â€” IPB 2025/2026
</p>

---

## ðŸ“‹ Ãndice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Stack TecnolÃ³gico](#stack-tecnolÃ³gico)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [InÃ­cio RÃ¡pido (Docker)](#inÃ­cio-rÃ¡pido-docker)
- [InstalaÃ§Ã£o Manual](#instalaÃ§Ã£o-manual)
- [VariÃ¡veis de Ambiente](#variÃ¡veis-de-ambiente)
- [Credenciais de Demo](#credenciais-de-demo)
- [API Endpoints](#api-endpoints)
- [Autores e OrientaÃ§Ã£o](#autores-e-orientaÃ§Ã£o)

---

## Sobre o Projeto

A gestÃ£o financeira eficaz Ã© um desafio constante para as empresas de construÃ§Ã£o civil, dado o grande nÃºmero de variÃ¡veis e a complexidade das obras. A **ConstruManage** Ã© uma soluÃ§Ã£o tecnolÃ³gica que permite a gestÃ£o integrada e eficiente dos aspetos financeiros de uma empresa de construÃ§Ã£o civil, proporcionando uma visÃ£o clara dos fluxos de caixa, orÃ§amentos e custos.

---

## Funcionalidades

| MÃ³dulo | DescriÃ§Ã£o |
|--------|-----------|
| **ðŸ“Š Dashboard em Tempo Real** | VisualizaÃ§Ã£o de receitas, despesas, saldo atual, grÃ¡ficos interativos |
| **ðŸ’° Controle OrÃ§amental** | MonitorizaÃ§Ã£o do cumprimento de orÃ§amentos por obra com barras de progresso |
| **ðŸ’¸ Fluxo de Caixa** | Registo e acompanhamento de entradas/saÃ­das com formulÃ¡rio interativo |
| **ðŸš› Fornecedores & Pagamentos** | GestÃ£o de pagamentos a fornecedores e subcontratados com alertas |
| **ðŸ“ˆ PrevisÃµes Financeiras** | ProjeÃ§Ãµes a 6 meses com anÃ¡lise preditiva de risco de tesouraria |
| **ðŸ” AutenticaÃ§Ã£o JWT** | Login seguro, registo de utilizadores, refresh automÃ¡tico de tokens |

---

## Stack TecnolÃ³gico

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | Python 3.12, Django 5, Django REST Framework, Simple JWT, Gunicorn |
| **Frontend** | React 18, Vite 5, React Router 6, Recharts, Axios |
| **Base de Dados** | PostgreSQL 16 |
| **Infraestrutura** | Docker, Docker Compose, Nginx |
| **Design** | CSS custom (dark-slate + amber), Inter (Google Fonts), FontAwesome 6 |

---

## Estrutura do Projeto

```
GestaoFinanceiraConstrucao/
â”œâ”€â”€ docker-compose.yml          # OrquestraÃ§Ã£o dos 3 serviÃ§os
â”œâ”€â”€ .gitignore
â”œâ”€â”€ README.md
â”œâ”€â”€ DOCUMENTATION.md
â”‚
â”œâ”€â”€ backend/                    # Django REST API
¦   +-- .env                    # Variaveis locais da API (NAO incluir no Git)
¦   +-- .env.docker             # Variaveis Docker da API (NAO incluir no Git)
¦   +-- .env.example            # Template de variaveis da API
â”‚   â”œâ”€â”€ Dockerfile
â”‚   â”œâ”€â”€ entrypoint.sh           # Espera PostgreSQL + migrations + seed
â”‚   â”œâ”€â”€ requirements.txt
â”‚   â”œâ”€â”€ manage.py
â”‚   â”œâ”€â”€ construmanage/
â”‚   â”‚   â”œâ”€â”€ settings.py         # Config via env vars + PostgreSQL
â”‚   â”‚   â”œâ”€â”€ urls.py
â”‚   â”‚   â””â”€â”€ wsgi.py
â”‚   â””â”€â”€ api/
â”‚       â”œâ”€â”€ models.py
â”‚       â”œâ”€â”€ serializers.py
â”‚       â”œâ”€â”€ views.py
â”‚       â”œâ”€â”€ urls.py
â”‚       â”œâ”€â”€ admin.py
â”‚       â””â”€â”€ management/commands/
â”‚           â””â”€â”€ seed_data.py
â”‚
â””â”€â”€ frontend/                   # React + Vite
    â”œâ”€â”€ Dockerfile              # Multi-stage: Node build + Nginx
    â”œâ”€â”€ nginx.conf              # SPA routing + API proxy
    â”œâ”€â”€ package.json
    â”œâ”€â”€ vite.config.js
    â””â”€â”€ src/
        â”œâ”€â”€ App.jsx
        â”œâ”€â”€ index.css
        â”œâ”€â”€ api/api.js
        â”œâ”€â”€ components/
        â”‚   â”œâ”€â”€ Sidebar.jsx
        â”‚   â””â”€â”€ TopHeader.jsx
        │   └── PageFilters.jsx
        â””â”€â”€ pages/
            â”œâ”€â”€ Login.jsx
            â”œâ”€â”€ Register.jsx
            â”œâ”€â”€ Dashboard.jsx
            â”œâ”€â”€ Obras.jsx
            â”œâ”€â”€ FluxoCaixa.jsx
            â”œâ”€â”€ Fornecedores.jsx
            â””â”€â”€ Previsoes.jsx
```

---

## InÃ­cio RÃ¡pido (Docker)

> **PrÃ©-requisito:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execuÃ§Ã£o.

```bash
# 1. Clonar / navegar para a pasta do projeto
cd GestaoFinanceiraConstrucao

# 2. Copiar e configurar variÃ¡veis de ambiente
cp backend/.env.example backend/.env
cp backend/.env.example backend/.env.docker
# Editar backend/.env e backend/.env.docker com valores seguros antes de iniciar

# 3. Construir e iniciar todos os serviÃ§os
docker compose up --build -d

# 4. Aceder Ã  aplicaÃ§Ã£o
# Frontend:      http://localhost
# Backend API:   http://localhost:8000/api/
# Django Admin:  http://localhost:8000/admin/
```

### Comandos Docker Ãšteis

```bash
# Ver logs de todos os serviÃ§os
docker compose logs -f

# Ver logs de um serviÃ§o especÃ­fico
docker compose logs -f backend

# Parar todos os serviÃ§os
docker compose down

# Parar e remover volumes (limpar base de dados)
docker compose down -v

# Reconstruir apÃ³s alteraÃ§Ãµes no cÃ³digo
docker compose up --build -d
```

---

## InstalaÃ§Ã£o Manual

<details>
<summary>Caso prefira executar sem Docker (desenvolvimento local)</summary>

### Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux: source venv/bin/activate
pip install -r requirements.txt

# Configurar variÃ¡veis de ambiente (POSTGRES_HOST=localhost, etc.)
python manage.py makemigrations
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

> **Nota:** Ã‰ necessÃ¡rio ter PostgreSQL a correr localmente e configurar as variÃ¡veis no `.env`.

</details>

---

## VariÃ¡veis de Ambiente

As configuracoes sensiveis da API/backend ficam em `backend/.env` para desenvolvimento local e `backend/.env.docker` para Docker.

| VariÃ¡vel | DescriÃ§Ã£o | Default |
|----------|-----------|---------|
| `DJANGO_SECRET_KEY` | Chave secreta do Django | Obrigatorio |
| `DJANGO_DEBUG` | Modo debug (True/False) | `True` |
| `DJANGO_ALLOWED_HOSTS` | Hosts permitidos (separados por vÃ­rgula) | `localhost,127.0.0.1` |
| `POSTGRES_DB` | Nome da base de dados | `construmanage_db` |
| `POSTGRES_USER` | Utilizador PostgreSQL | `construmanage_user` |
| `POSTGRES_PASSWORD` | Password PostgreSQL | Obrigatorio |
| `POSTGRES_HOST` | Host da DB (`db` em Docker) | `db` |
| `POSTGRES_PORT` | Porta da DB | `5432` |
| `SEED_ADMIN_USERNAME` | Utilizador admin criado pelo seed | `admin` |
| `SEED_ADMIN_EMAIL` | E-mail do admin criado pelo seed | `admin@construmanage.pt` |
| `SEED_ADMIN_PASSWORD` | Password do admin criado pelo seed | Obrigatorio para criar admin |
| `SEED_USER_USERNAME` | Utilizador demo criado pelo seed | `davide` |
| `SEED_USER_EMAIL` | E-mail do utilizador demo | `davide@construmanage.pt` |
| `SEED_USER_PASSWORD` | Password do utilizador demo | Obrigatorio para criar utilizador |
| `SEED_USER_FIRST_NAME` | Primeiro nome do utilizador demo | `Davide` |
| `SEED_USER_LAST_NAME` | Apelido do utilizador demo | `Moreno` |
| `JWT_ACCESS_TOKEN_LIFETIME_HOURS` | DuraÃ§Ã£o do access token (horas) | `1` |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | DuraÃ§Ã£o do refresh token (dias) | `7` |
| `CORS_ALLOWED_ORIGINS` | Origens CORS permitidas | â€” |

---

## Credenciais de Demo

O seed automÃ¡tico cria os seguintes utilizadores:

| Utilizador demo | Password demo | Tipo |
|-----------------|---------------|------|
| `admin` | `admin123` | Superuser (Django Admin) |
| `davide` | `davide1234` | Utilizador normal |

Estes valores estao definidos em `backend/.env` e `backend/.env.docker`. O template `backend/.env.example` usa placeholders.

As passwords nao estao hardcoded no codigo; devem ser configuradas em `backend/.env` ou `backend/.env.docker` antes de executar `seed_data.py`.
Se `SEED_ADMIN_PASSWORD` ou `SEED_USER_PASSWORD` nao estiverem definidas, o respetivo utilizador demo nao e criado.

---

## API Endpoints

Base URL: `http://localhost:8000/api/` (direto) ou `http://localhost/api/` (via Nginx)

| MÃ©todo | Endpoint | DescriÃ§Ã£o | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login/` | Obter tokens JWT | âŒ |
| POST | `/api/auth/refresh/` | Renovar access token | âŒ |
| POST | `/api/auth/register/` | Registar utilizador | âŒ |
| GET | `/api/dashboard/` | Dashboard agregado | âœ… |
| CRUD | `/api/obras/` | Obras de construÃ§Ã£o | âœ… |
| CRUD | `/api/transacoes/` | TransaÃ§Ãµes (fluxo de caixa) | âœ… |
| CRUD | `/api/fornecedores/` | Fornecedores | âœ… |
| CRUD | `/api/previsoes/` | PrevisÃµes financeiras | âœ… |
| GET/PATCH/DELETE | `/api/notificacoes/` | Notificacoes e historico | sim |

---

## Autores e OrientaÃ§Ã£o

**Orientador:** JoÃ£o Paulo Pereira (jprp@ipb.pt)
**Coorientador:** JoÃ£o Paulo Baptista Pereira (joaopaulo.pereira@ipb.pt)

**Curso:** Licenciatura em Tecnologias Digitais e GestÃ£o
**InstituiÃ§Ã£o:** Instituto PolitÃ©cnico de BraganÃ§a (IPB)
**Ano letivo:** 2025/2026

---

## LicenÃ§a

Projeto desenvolvido para fins acadÃ©micos no Ã¢mbito do Projeto de 3Âº Ano do IPB.
