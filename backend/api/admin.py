from django.contrib import admin
from .models import Obra, Transacao, Fornecedor, PrevisaoFinanceira, Notificacao


@admin.register(Obra)
class ObraAdmin(admin.ModelAdmin):
    list_display = ['nome', 'orcamento_aprovado', 'custo_atual', 'status', 'progresso']
    list_filter = ['status']


@admin.register(Transacao)
class TransacaoAdmin(admin.ModelAdmin):
    list_display = ['descricao', 'tipo', 'valor', 'categoria', 'data']
    list_filter = ['tipo', 'categoria']


@admin.register(Fornecedor)
class FornecedorAdmin(admin.ModelAdmin):
    list_display = ['nome', 'servico', 'valor', 'prazo_pagamento', 'status_pagamento']
    list_filter = ['status_pagamento']


@admin.register(PrevisaoFinanceira)
class PrevisaoAdmin(admin.ModelAdmin):
    list_display = ['mes', 'recebimentos_previstos', 'pagamentos_previstos']


@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'tipo', 'origem_tipo', 'origem_id', 'lida', 'criado_em']
    list_filter = ['tipo', 'lida']
