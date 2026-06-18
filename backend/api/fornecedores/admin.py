from django.contrib import admin

from api.fornecedores.models import Fornecedor


@admin.register(Fornecedor)
class FornecedorAdmin(admin.ModelAdmin):
    list_display = ['nome', 'servico', 'valor', 'prazo_pagamento', 'status_pagamento']
    list_filter = ['status_pagamento']
