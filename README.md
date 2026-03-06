# 🏗️ ConstruManage — Plataforma de Gestão Financeira para Construção Civil

<p align="center">
  <strong>Plataforma web completa para gestão financeira integrada de empresas de construção civil.</strong><br>
  Desenvolvido no âmbito do Projeto de 3º Ano — Licenciatura em Tecnologias Digitais e Gestão — IPB 2025/2026
</p>

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológico](#stack-tecnológico)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Início Rápido (Docker)](#início-rápido-docker)
- [Instalação Manual](#instalação-manual)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Credenciais de Demo](#credenciais-de-demo)
- [API Endpoints](#api-endpoints)
- [Autores e Orientação](#autores-e-orientação)

---

## Sobre o Projeto

A gestão financeira eficaz é um desafio constante para as empresas de construção civil, dado o grande número de variáveis e a complexidade das obras. A **ConstruManage** é uma solução tecnológica que permite a gestão integrada e eficiente dos aspetos financeiros de uma empresa de construção civil, proporcionando uma visão clara dos fluxos de caixa, orçamentos e custos.

---

## Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| **📊 Dashboard em Tempo Real** | Visualização de receitas, despesas, saldo atual, gráficos interativos |
| **💰 Controle Orçamental** | Monitorização do cumprimento de orçamentos por obra com barras de progresso |
| **💸 Fluxo de Caixa** | Registo e acompanhamento de entradas/saídas com formulário interativo |
| **🚛 Fornecedores & Pagamentos** | Gestão de pagamentos a fornecedores e subcontratados com alertas |
| **📈 Previsões Financeiras** | Projeções a 6 meses com análise preditiva de risco de tesouraria |
| **🔐 Autenticação JWT** | Login seguro, registo de utilizadores, refresh automático de tokens |

---

## Stack Tecnológico

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
├── docker-compose.yml          # Orquestração dos 3 serviços
├── .env                        # Variáveis de ambiente (NÃO incluir no Git)
├── .env.example                # Template de variáveis
├── .gitignore
├── README.md
├── DOCUMENTATION.md
│
├── backend/                    # Django REST API
│   ├── Dockerfile
│   ├── entrypoint.sh           # Espera PostgreSQL + migrations + seed
│   ├── requirements.txt
│   ├── manage.py
│   ├── construmanage/
│   │   ├── settings.py         # Config via env vars + PostgreSQL
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── api/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       └── management/commands/
│           └── seed_data.py
│
└── frontend/                   # React + Vite
    ├── Dockerfile              # Multi-stage: Node build + Nginx
    ├── nginx.conf              # SPA routing + API proxy
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── index.css
        ├── api/api.js
        ├── components/
        │   ├── Sidebar.jsx
        │   └── TopHeader.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Orcamentos.jsx
            ├── FluxoCaixa.jsx
            ├── Fornecedores.jsx
            └── Previsoes.jsx
```

---

## Início Rápido (Docker)

> **Pré-requisito:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.

```bash
# 1. Clonar / navegar para a pasta do projeto
cd GestaoFinanceiraConstrucao

# 2. Copiar e configurar variáveis de ambiente
cp .env.example .env
# Editar .env com os valores desejados (ou manter os defaults)

# 3. Construir e iniciar todos os serviços
docker compose up --build -d

# 4. Aceder à aplicação
# Frontend:      http://localhost
# Backend API:   http://localhost:8000/api/
# Django Admin:  http://localhost:8000/admin/
```

### Comandos Docker Úteis

```bash
# Ver logs de todos os serviços
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend

# Parar todos os serviços
docker compose down

# Parar e remover volumes (limpar base de dados)
docker compose down -v

# Reconstruir após alterações no código
docker compose up --build -d
```

---

## Instalação Manual

<details>
<summary>Caso prefira executar sem Docker (desenvolvimento local)</summary>

### Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux: source venv/bin/activate
pip install -r requirements.txt

# Configurar variáveis de ambiente (POSTGRES_HOST=localhost, etc.)
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

> **Nota:** É necessário ter PostgreSQL a correr localmente e configurar as variáveis no `.env`.

</details>

---

## Variáveis de Ambiente

Todas as configurações sensíveis são geridas via ficheiro `.env` na raiz do projeto.

| Variável | Descrição | Default |
|----------|-----------|---------|
| `DJANGO_SECRET_KEY` | Chave secreta do Django | *dev fallback* |
| `DJANGO_DEBUG` | Modo debug (True/False) | `True` |
| `DJANGO_ALLOWED_HOSTS` | Hosts permitidos (separados por vírgula) | `localhost,127.0.0.1` |
| `POSTGRES_DB` | Nome da base de dados | `construmanage_db` |
| `POSTGRES_USER` | Utilizador PostgreSQL | `construmanage_user` |
| `POSTGRES_PASSWORD` | Password PostgreSQL | — |
| `POSTGRES_HOST` | Host da DB (`db` em Docker) | `db` |
| `POSTGRES_PORT` | Porta da DB | `5432` |
| `JWT_ACCESS_TOKEN_LIFETIME_HOURS` | Duração do access token (horas) | `1` |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | Duração do refresh token (dias) | `7` |
| `CORS_ALLOWED_ORIGINS` | Origens CORS permitidas | — |

---

## Credenciais de Demo

O seed automático cria os seguintes utilizadores:

| Utilizador | Password | Tipo |
|------------|----------|------|
| `admin` | `admin123` | Superuser (Django Admin) |
| `joao` | `joao1234` | Utilizador normal |

---

## API Endpoints

Base URL: `http://localhost:8000/api/` (direto) ou `http://localhost/api/` (via Nginx)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login/` | Obter tokens JWT | ❌ |
| POST | `/api/auth/refresh/` | Renovar access token | ❌ |
| POST | `/api/auth/register/` | Registar utilizador | ❌ |
| GET | `/api/dashboard/` | Dashboard agregado | ✅ |
| CRUD | `/api/obras/` | Obras de construção | ✅ |
| CRUD | `/api/transacoes/` | Transações (fluxo de caixa) | ✅ |
| CRUD | `/api/fornecedores/` | Fornecedores | ✅ |
| CRUD | `/api/previsoes/` | Previsões financeiras | ✅ |

---

## Autores e Orientação

**Orientador:** João Paulo Pereira (jprp@ipb.pt)
**Coorientador:** João Paulo Baptista Pereira (joaopaulo.pereira@ipb.pt)

**Curso:** Licenciatura em Tecnologias Digitais e Gestão
**Instituição:** Instituto Politécnico de Bragança (IPB)
**Ano letivo:** 2025/2026

---

## Licença

Projeto desenvolvido para fins académicos no âmbito do Projeto de 3º Ano do IPB.
