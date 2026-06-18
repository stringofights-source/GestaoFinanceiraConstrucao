from django.contrib import admin

from api.notificacoes.models import Notificacao


@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'tipo', 'origem_tipo', 'origem_id', 'lida', 'criado_em']
    list_filter = ['tipo', 'lida']
