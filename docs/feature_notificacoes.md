# Feature: Notificacoes

## Objetivo

As notificacoes persistem alertas operacionais gerados a partir dos dados financeiros existentes. A funcionalidade cobre pagamentos de fornecedores e desvios de orcamento de obras, sem introduzir regras fora do dominio atual.

## Modelo de Dados

Modelo: `Notificacao`

Campos principais:

- `tipo`: `pagamento_vencido`, `pagamento_pendente` ou `desvio_orcamento`.
- `titulo`: resumo curto apresentado na interface.
- `mensagem`: detalhe da ocorrencia.
- `origem_tipo`: entidade de origem, por exemplo `fornecedor` ou `obra`.
- `origem_id`: id da entidade de origem.
- `lida`: estado de leitura.
- `criado_em`, `atualizado_em`, `lida_em`: historico de criacao, atualizacao e leitura.

A combinacao `tipo`, `origem_tipo` e `origem_id` e unica para evitar duplicados da mesma ocorrencia.

## Regras de Geracao

A sincronizacao corre por acao explicita em `POST /api/notificacoes/sincronizar/`.

Regras atuais:

1. Pagamento vencido
   - Origem: `Fornecedor`.
   - Condicao: `status_pagamento != pago` e `prazo_pagamento < hoje`.
   - Tipo: `pagamento_vencido`.

2. Pagamento pendente
   - Origem: `Fornecedor`.
   - Condicao: `status_pagamento != pago` e `prazo_pagamento` entre hoje e os proximos 7 dias.
   - Tipo: `pagamento_pendente`.

3. Desvio de orcamento
   - Origem: `Obra`.
   - Condicao: `custo_atual > orcamento_aprovado`.
   - Tipo: `desvio_orcamento`.

As notificacoes antigas nao sao apagadas automaticamente quando a situacao muda. Isto preserva historico e evita perda de contexto operacional.

## Endpoints

Base: `/api/notificacoes/`

- `GET /api/notificacoes/`: lista notificacoes persistidas.
- `GET /api/notificacoes/{id}/`: detalhe de uma notificacao.
- `PATCH /api/notificacoes/{id}/`: atualizacao parcial, incluindo `lida`.
- `DELETE /api/notificacoes/{id}/`: remove uma notificacao do historico.
- `POST /api/notificacoes/sincronizar/`: sincroniza novas ocorrencias a partir de fornecedores e obras.
- `POST /api/notificacoes/{id}/marcar_lida/`: marca uma notificacao como lida.
- `POST /api/notificacoes/marcar_todas_lidas/`: marca todas as notificacoes como lidas.

Todos os endpoints exigem autenticacao JWT, seguindo a configuracao global do Django REST Framework.

## Interface

O `TopHeader` sincroniza notificacoes por POST, consulta `/api/notificacoes/`, mostra a contagem de notificacoes nao lidas no sino e apresenta um dropdown com o historico recente. Ao clicar numa notificacao, ela e marcada como lida. O menu tambem permite marcar todas como lidas.

## Gestao e Historico

O historico vive na tabela `api_notificacao`. Uma notificacao pode ser:

- Nao lida: aparece destacada e conta no badge.
- Lida: permanece visivel no historico, sem contar no badge.
- Removida: sai do historico via `DELETE`.

As notificacoes geradas automaticamente sao idempotentes: sincronizar varias vezes nao cria duplicados para a mesma origem e tipo.
