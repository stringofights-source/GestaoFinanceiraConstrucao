# ConstruManage - Documentacao Tecnica

## 1. Arquitetura

A aplicacao usa uma arquitetura cliente-servidor:

- Frontend: React + Vite, servido em Docker por Nginx.
- Backend: Django + Django REST Framework + Simple JWT.
- Base de dados: PostgreSQL.
- Orquestracao: Docker Compose.

O frontend consome a API em `/api/` e o Nginx encaminha esses pedidos para o backend.

## 2. Configuracao por Ambiente

As variaveis sensiveis da API ficam no backend:

- `backend/.env`: desenvolvimento local.
- `backend/.env.docker`: Docker Compose.
- `backend/.env.example`: template sem credenciais reais.

O frontend nao tem ficheiros `.env` nesta versao.

Variaveis principais:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `SEED_ADMIN_USERNAME`
- `SEED_ADMIN_PASSWORD`
- `SEED_USER_USERNAME`
- `SEED_USER_PASSWORD`
- `JWT_ACCESS_TOKEN_LIFETIME_HOURS`
- `JWT_REFRESH_TOKEN_LIFETIME_DAYS`
- `CORS_ALLOWED_ORIGINS`

`settings.py` nao tem `SECRET_KEY` nem password PostgreSQL hardcoded; esses valores sao obrigatorios por variavel de ambiente.

## 3. Modelo de Dados

Modelos principais:

- `Obra`: dados de obra, orcamento aprovado, custo atual, progresso e estado.
- `Transacao`: entradas e saidas financeiras, categoria, data e obra opcional.
- `Fornecedor`: pagamentos a fornecedores/subcontratados, prazo, valor e estado.
- `PrevisaoFinanceira`: previsoes mensais de recebimentos e pagamentos.
- `Notificacao`: alertas persistentes gerados a partir de fornecedores e obras.

Relacoes:

- `Obra` 1:N `Transacao`
- `Obra` 1:N `Fornecedor`
- `Notificacao` referencia a origem por `origem_tipo` e `origem_id`.

## 4. Autenticacao

Autenticacao JWT via Simple JWT:

- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `POST /api/auth/register/`

O frontend guarda `access_token` e `refresh_token` em `sessionStorage`, limpa tokens antigos de `localStorage` e renova automaticamente o access token quando recebe `401`.

## 5. API

Base URL local:

- Direto: `http://localhost:8000/api/`
- Via Nginx: `http://localhost/api/`

Endpoints autenticados:

| Recurso | Lista/Criacao | Detalhe |
|---------|---------------|---------|
| Obras | `GET/POST /api/obras/` | `GET/PUT/PATCH/DELETE /api/obras/{id}/` |
| Transacoes | `GET/POST /api/transacoes/` | `GET/PUT/PATCH/DELETE /api/transacoes/{id}/` |
| Fornecedores | `GET/POST /api/fornecedores/` | `GET/PUT/PATCH/DELETE /api/fornecedores/{id}/` |
| Previsoes | `GET/POST /api/previsoes/` | `GET/PUT/PATCH/DELETE /api/previsoes/{id}/` |
| Notificacoes | `GET /api/notificacoes/` | `GET/PATCH/DELETE /api/notificacoes/{id}/` |

Endpoints especificos:

- `GET /api/dashboard/`
- `POST /api/notificacoes/{id}/marcar_lida/`
- `POST /api/notificacoes/marcar_todas_lidas/`

## 6. Frontend

Rotas:

- `/`: `Dashboard.jsx`
- `/obras`: `Obras.jsx`
- `/fluxo-caixa`: `FluxoCaixa.jsx`
- `/fornecedores`: `Fornecedores.jsx`
- `/previsoes`: `Previsoes.jsx`
- `/login`: `Login.jsx`
- `/register`: `Register.jsx`

Componentes partilhados:

- `Sidebar.jsx`: navegacao principal e fecho automatico em mobile/tablet.
- `TopHeader.jsx`: utilizador, logout, notificacoes reais e botao mobile da sidebar.
- `PageFilters.jsx`: filtro de texto por pagina.

Nao existe filtro global na navbar. Cada pagina com tabela gere o seu proprio filtro local:

- Obras: nome e descricao.
- Transacoes: descricao, categoria, tipo e obra.
- Fornecedores: nome, servico e obra, com segmentos para todos, vencidos, pendentes/agendados e pagos.

## 7. Notificacoes

As notificacoes sao documentadas em detalhe em `docs/feature_notificacoes.md`.

Resumo das regras:

- Pagamentos de fornecedores vencidos.
- Pagamentos de fornecedores pendentes nos proximos 7 dias.
- Obras com custo atual acima do orcamento aprovado.

As notificacoes sao persistidas, podem ser marcadas como lidas e mantem historico.

## 8. Seed

`python manage.py seed_data` cria dados de demonstracao.

Credenciais demo configuradas nos ficheiros locais:

- Admin: `admin` / `admin123`
- Utilizador: `davide` / `davide1234`

O comando tambem aceita `--users-only`, que pode ser usado para sincronizar utilizadores demo sem limpar dados de negocio.

## 9. Docker

`docker-compose.yml` usa `backend/.env.docker`.

Servicos:

- `db`: PostgreSQL.
- `backend`: Django API.
- `frontend`: React build servido por Nginx.

O entrypoint do backend:

1. Aguarda PostgreSQL.
2. Aplica migrations.
3. Se `RUN_DEMO_SEED=true`, sincroniza utilizadores demo e carrega seed completo quando a base estiver vazia.
4. Inicia Gunicorn.

## 10. Producao

Antes de producao:

- Definir `DJANGO_DEBUG=False`.
- Gerar `DJANGO_SECRET_KEY` forte.
- Configurar `DJANGO_ALLOWED_HOSTS`.
- Usar password PostgreSQL forte.
- Restringir `CORS_ALLOWED_ORIGINS`.
- Configurar HTTPS.

Notas adicionais:

- A base de dados ativa e PostgreSQL, configurada em `backend/config/settings/base.py`.
- `backend/db.sqlite3` pode existir como artefacto local, mas nao e usado pelos settings atuais.
- Dados e utilizadores demo so devem ser ativados com `RUN_DEMO_SEED=true` em ambientes de demonstracao.
- Ver tambem `docs/production_readiness.md`.
