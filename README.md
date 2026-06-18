# Ã°Å?Â?â¤?Ã¯Â?Â? ConstruManage Ã¢â?¬â¤? Plataforma de GestÃ?Â£o Financeira para ConstruÃ?Â§Ã?Â£o Civil

<p align="center">
  <strong>Plataforma web completa para gestÃ?Â£o financeira integrada de empresas de construÃ?Â§Ã?Â£o civil.</strong><br>
  Desenvolvido no Ã?Â¢mbito do Projeto de 3Ã?Âº Ano Ã¢â?¬â¤? Licenciatura em Tecnologias Digitais e GestÃ?Â£o Ã¢â?¬â¤? IPB 2025/2026
</p>

---

## Ã°Å?â¤½â¤¹ Ã?Â?ndice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Stack TecnolÃ?Â³gico](#stack-tecnolÃ?Â³gico)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [InÃ?Â­cio RÃ?Â¡pido (Docker)](#inÃ?Â­cio-rÃ?Â¡pido-docker)
- [InstalaÃ?Â§Ã?Â£o Manual](#instalaÃ?Â§Ã?Â£o-manual)
- [VariÃ?Â¡veis de Ambiente](#variÃ?Â¡veis-de-ambiente)
- [Credenciais de Demo](#credenciais-de-demo)
- [API Endpoints](#api-endpoints)
- [Autores e OrientaÃ?Â§Ã?Â£o](#autores-e-orientaÃ?Â§Ã?Â£o)

---

## Sobre o Projeto

A gestÃ?Â£o financeira eficaz Ã?Â© um desafio constante para as empresas de construÃ?Â§Ã?Â£o civil, dado o grande nÃ?Âºmero de variÃ?Â¡veis e a complexidade das obras. A **ConstruManage** Ã?Â© uma soluÃ?Â§Ã?Â£o tecnolÃ?Â³gica que permite a gestÃ?Â£o integrada e eficiente dos aspetos financeiros de uma empresa de construÃ?Â§Ã?Â£o civil, proporcionando uma visÃ?Â£o clara dos fluxos de caixa, orÃ?Â§amentos e custos.

---

## Funcionalidades

| MÃ?Â³dulo | DescriÃ?Â§Ã?Â£o |
|--------|-----------|
| **Ã°Å?â¤½Å  Dashboard em Tempo Real** | VisualizaÃ?Â§Ã?Â£o de receitas, despesas, saldo atual, grÃ?Â¡ficos interativos |
| **Ã°Å?â¤?Â° Controle OrÃ?Â§amental** | MonitorizaÃ?Â§Ã?Â£o do cumprimento de orÃ?Â§amentos por obra com barras de progresso |
| **Ã°Å?â¤?Â? Fluxo de Caixa** | Registo e acompanhamento de entradas/saÃ?Â­das com formulÃ?Â¡rio interativo |
| **Ã°Å?Å¡â¤º Fornecedores & Pagamentos** | GestÃ?Â£o de pagamentos a fornecedores e subcontratados com alertas |
| **Ã°Å?â¤½Ë? PrevisÃ?Âµes Financeiras** | ProjeÃ?Â§Ã?Âµes a 6 meses com anÃ?Â¡lise preditiva de risco de tesouraria |
| **Ã°Å?â¤?Â? AutenticaÃ?Â§Ã?Â£o JWT** | Login seguro, registo de utilizadores, refresh automÃ?Â¡tico de tokens |

---

## Stack TecnolÃ?Â³gico

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
Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ docker-compose.yml          # OrquestraÃ?Â§Ã?Â£o dos 3 serviÃ?Â§os
Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ .gitignore
Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ README.md
Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ DOCUMENTATION.md
Ã¢â¤?â¤¨
Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ backend/                    # Django REST API
Â?   +-- .env                    # Variaveis locais da API (NAO incluir no Git)
Â?   +-- .env.docker             # Variaveis Docker da API (NAO incluir no Git)
Â?   +-- .env.example            # Template de variaveis da API
Ã¢â¤?â¤¨   Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ Dockerfile
Ã¢â¤?â¤¨   Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ entrypoint.sh           # Espera PostgreSQL + migrations + seed
Ã¢â¤?â¤¨   Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ requirements.txt
Ã¢â¤?â¤¨   Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ manage.py
Ã¢â¤?â¤¨   Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ construmanage/
Ã¢â¤?â¤¨   Ã¢â¤?â¤¨   Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ settings.py         # Config via env vars + PostgreSQL
Ã¢â¤?â¤¨   Ã¢â¤?â¤¨   Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ urls.py
Ã¢â¤?â¤¨   Ã¢â¤?â¤¨   Ã¢â¤?â¤?Ã¢â¤?â?¬Ã¢â¤?â?¬ wsgi.py
Ã¢â¤?â¤¨   Ã¢â¤?â¤?Ã¢â¤?â?¬Ã¢â¤?â?¬ api/
Ã¢â¤?â¤¨       Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ models.py
Ã¢â¤?â¤¨       Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ serializers.py
Ã¢â¤?â¤¨       Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ views.py
Ã¢â¤?â¤¨       Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ urls.py
Ã¢â¤?â¤¨       Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ admin.py
Ã¢â¤?â¤¨       Ã¢â¤?â¤?Ã¢â¤?â?¬Ã¢â¤?â?¬ management/commands/
Ã¢â¤?â¤¨           Ã¢â¤?â¤?Ã¢â¤?â?¬Ã¢â¤?â?¬ seed_data.py
Ã¢â¤?â¤¨
Ã¢â¤?â¤?Ã¢â¤?â?¬Ã¢â¤?â?¬ frontend/                   # React + Vite
    Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ Dockerfile              # Multi-stage: Node build + Nginx
    Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ nginx.conf              # SPA routing + API proxy
    Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ package.json
    Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ vite.config.js
    Ã¢â¤?â¤?Ã¢â¤?â?¬Ã¢â¤?â?¬ src/
        Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ App.jsx
        Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ index.css
        Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ api/api.js
        Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ components/
        Ã¢â¤?â¤¨   Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ Sidebar.jsx
        Ã¢â¤?â¤¨   Ã¢â¤?â¤?Ã¢â¤?â?¬Ã¢â¤?â?¬ TopHeader.jsx
        â??   â??â?¤â?¤ PageFilters.jsx
        Ã¢â¤?â¤?Ã¢â¤?â?¬Ã¢â¤?â?¬ pages/
            Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ Login.jsx
            Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ Register.jsx
            Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ Dashboard.jsx
            Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ Obras.jsx
            Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ FluxoCaixa.jsx
            Ã¢â¤?Å?Ã¢â¤?â?¬Ã¢â¤?â?¬ Fornecedores.jsx
            Ã¢â¤?â¤?Ã¢â¤?â?¬Ã¢â¤?â?¬ Previsoes.jsx
```

---

## InÃ?Â­cio RÃ?Â¡pido (Docker)

> **PrÃ?Â©-requisito:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execuÃ?Â§Ã?Â£o.

```bash
# 1. Clonar / navegar para a pasta do projeto
cd GestaoFinanceiraConstrucao

# 2. Copiar e configurar variÃ?Â¡veis de ambiente
cp backend/.env.example backend/.env
cp backend/.env.example backend/.env.docker
# Editar backend/.env e backend/.env.docker com valores seguros antes de iniciar

# 3. Construir e iniciar todos os serviÃ?Â§os
docker compose up --build -d

# 4. Aceder Ã?Â  aplicaÃ?Â§Ã?Â£o
# Frontend:      http://localhost
# Backend API:   http://localhost:8000/api/
# Django Admin:  http://localhost:8000/admin/
```

### Comandos Docker Ã?Å¡teis

```bash
# Ver logs de todos os serviÃ?Â§os
docker compose logs -f

# Ver logs de um serviÃ?Â§o especÃ?Â­fico
docker compose logs -f backend

# Parar todos os serviÃ?Â§os
docker compose down

# Parar e remover volumes (limpar base de dados)
docker compose down -v

# Reconstruir apÃ?Â³s alteraÃ?Â§Ã?Âµes no cÃ?Â³digo
docker compose up --build -d
```

---

## InstalaÃ?Â§Ã?Â£o Manual

<details>
<summary>Caso prefira executar sem Docker (desenvolvimento local)</summary>

### Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux: source venv/bin/activate
pip install -r requirements.txt

# Configurar variÃ?Â¡veis de ambiente (POSTGRES_HOST=localhost, etc.)
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

> **Nota:** Ã?â¤° necessÃ?Â¡rio ter PostgreSQL a correr localmente e configurar as variÃ?Â¡veis no `.env`.

</details>

---

## VariÃ?Â¡veis de Ambiente

As configuracoes sensiveis da API/backend ficam em `backend/.env` para desenvolvimento local e `backend/.env.docker` para Docker.

| VariÃ?Â¡vel | DescriÃ?Â§Ã?Â£o | Default |
|----------|-----------|---------|
| `DJANGO_SECRET_KEY` | Chave secreta do Django | Obrigatorio |
| `DJANGO_DEBUG` | Modo debug (True/False) | `True` |
| `DJANGO_ALLOWED_HOSTS` | Hosts permitidos (separados por vÃ?Â­rgula) | `localhost,127.0.0.1` |
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
| `JWT_ACCESS_TOKEN_LIFETIME_HOURS` | DuraÃ?Â§Ã?Â£o do access token (horas) | `1` |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | DuraÃ?Â§Ã?Â£o do refresh token (dias) | `7` |
| `CORS_ALLOWED_ORIGINS` | Origens CORS permitidas | Ã¢â?¬â¤? |

---

## Credenciais de Demo

O seed automÃ?Â¡tico cria os seguintes utilizadores:

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

| MÃ?Â©todo | Endpoint | DescriÃ?Â§Ã?Â£o | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login/` | Obter tokens JWT | Ã¢Â?Å? |
| POST | `/api/auth/refresh/` | Renovar access token | Ã¢Â?Å? |
| POST | `/api/auth/register/` | Registar utilizador | Ã¢Â?Å? |
| GET | `/api/dashboard/` | Dashboard agregado | Ã¢Å?â¤? |
| CRUD | `/api/obras/` | Obras de construÃ?Â§Ã?Â£o | Ã¢Å?â¤? |
| CRUD | `/api/transacoes/` | TransaÃ?Â§Ã?Âµes (fluxo de caixa) | Ã¢Å?â¤? |
| CRUD | `/api/fornecedores/` | Fornecedores | Ã¢Å?â¤? |
| CRUD | `/api/previsoes/` | PrevisÃ?Âµes financeiras | Ã¢Å?â¤? |
| GET/PATCH/DELETE | `/api/notificacoes/` | Notificacoes e historico | sim |

---

## Autores e OrientaÃ?Â§Ã?Â£o

**Orientador:** JoÃ?Â£o Paulo Pereira (jprp@ipb.pt)
**Coorientador:** JoÃ?Â£o Paulo Baptista Pereira (joaopaulo.pereira@ipb.pt)

**Curso:** Licenciatura em Tecnologias Digitais e GestÃ?Â£o
**InstituiÃ?Â§Ã?Â£o:** Instituto PolitÃ?Â©cnico de BraganÃ?Â§a (IPB)
**Ano letivo:** 2025/2026

---

## LicenÃ?Â§a

Projeto desenvolvido para fins acadÃ?Â©micos no Ã?Â¢mbito do Projeto de 3Ã?Âº Ano do IPB.
