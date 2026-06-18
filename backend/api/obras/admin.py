from django.contrib import admin

from api.obras.models import Obra


@admin.register(Obra)
class ObraAdmin(admin.ModelAdmin):
    list_display = ['nome', 'orcamento_aprovado', 'custo_atual', 'status', 'progresso']
    list_filter = ['status']
