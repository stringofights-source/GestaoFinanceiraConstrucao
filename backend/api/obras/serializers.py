from rest_framework import serializers

from api.obras.models import Obra
from api.service.validators import validate_obra_data


class ObraSerializer(serializers.ModelSerializer):
    desvio = serializers.ReadOnlyField()
    percentagem_orcamento = serializers.ReadOnlyField()

    class Meta:
        model = Obra
        fields = [
            'id',
            'nome',
            'descricao',
            'orcamento_aprovado',
            'custo_atual',
            'progresso',
            'status',
            'data_inicio',
            'data_fim_prevista',
            'criado_em',
            'atualizado_em',
            'desvio',
            'percentagem_orcamento',
        ]
        read_only_fields = ['id', 'criado_em', 'atualizado_em', 'desvio', 'percentagem_orcamento']

    def validate(self, attrs):
        instance_values = {}
        if self.instance:
            for field in ('progresso', 'orcamento_aprovado', 'custo_atual', 'data_inicio', 'data_fim_prevista'):
                instance_values[field] = getattr(self.instance, field)
        return validate_obra_data({**instance_values, **attrs})
