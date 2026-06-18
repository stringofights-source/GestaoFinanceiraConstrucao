from rest_framework import serializers

from api.financeiro.models import PrevisaoFinanceira, Transacao
from api.service.validators import validate_money_payload


class TransacaoSerializer(serializers.ModelSerializer):
    obra_nome = serializers.CharField(source='obra.nome', read_only=True, default=None)

    class Meta:
        model = Transacao
        fields = [
            'id',
            'descricao',
            'tipo',
            'valor',
            'categoria',
            'data',
            'obra',
            'obra_nome',
            'criado_em',
        ]
        read_only_fields = ['id', 'obra_nome', 'criado_em']

    def validate(self, attrs):
        return validate_money_payload(attrs)


class PrevisaoFinanceiraSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrevisaoFinanceira
        fields = [
            'id',
            'mes',
            'recebimentos_previstos',
            'pagamentos_previstos',
            'criado_em',
        ]
        read_only_fields = ['id', 'criado_em']

    def validate(self, attrs):
        validate_money_payload(attrs, 'recebimentos_previstos')
        validate_money_payload(attrs, 'pagamentos_previstos')
        return attrs
