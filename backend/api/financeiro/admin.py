from django.contrib import admin

from api.financeiro.models import PrevisaoFinanceira, Transacao


@admin.register(Transacao)
class TransacaoAdmin(admin.ModelAdmin):
    list_display = ['descricao', 'tipo', 'valor', 'categoria', 'data']
    list_filter = ['tipo', 'categoria']


@admin.register(PrevisaoFinanceira)
class PrevisaoAdmin(admin.ModelAdmin):
    list_display = ['mes', 'recebimentos_previstos', 'pagamentos_previstos']
