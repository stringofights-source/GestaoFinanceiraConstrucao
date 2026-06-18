from rest_framework import serializers

from api.notificacoes.models import Notificacao


class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = [
            'id',
            'tipo',
            'titulo',
            'mensagem',
            'origem_tipo',
            'origem_id',
            'lida',
            'criado_em',
            'atualizado_em',
            'lida_em',
        ]
        read_only_fields = [
            'id',
            'tipo',
            'titulo',
            'mensagem',
            'origem_tipo',
            'origem_id',
            'criado_em',
            'atualizado_em',
            'lida_em',
        ]
