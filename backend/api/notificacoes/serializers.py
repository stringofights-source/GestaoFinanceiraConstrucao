from django.utils import timezone
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

    def update(self, instance, validated_data):
        was_read = instance.lida
        instance = super().update(instance, validated_data)
        if 'lida' in validated_data:
            if instance.lida and not was_read and instance.lida_em is None:
                instance.lida_em = timezone.now()
                instance.save(update_fields=['lida_em', 'atualizado_em'])
            elif not instance.lida and instance.lida_em is not None:
                instance.lida_em = None
                instance.save(update_fields=['lida_em', 'atualizado_em'])
        return instance
