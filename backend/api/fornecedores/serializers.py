from rest_framework import serializers

from api.fornecedores.models import Fornecedor
from api.service.validators import validate_money_payload


class FornecedorSerializer(serializers.ModelSerializer):
    obra_nome = serializers.CharField(source='obra.nome', read_only=True, default=None)

    class Meta:
        model = Fornecedor
        fields = [
            'id',
            'nome',
            'servico',
            'obra',
            'obra_nome',
            'prazo_pagamento',
            'valor',
            'status_pagamento',
            'criado_em',
        ]
        read_only_fields = ['id', 'obra_nome', 'criado_em']

    def validate(self, attrs):
        return validate_money_payload(attrs)
