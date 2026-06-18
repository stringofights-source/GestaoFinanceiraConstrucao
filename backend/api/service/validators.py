from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers


def validate_password_strength(password, user=None):
    try:
        validate_password(password, user=user)
    except DjangoValidationError as exc:
        raise serializers.ValidationError(list(exc.messages)) from exc


def validate_obra_data(attrs):
    errors = {}
    progress = attrs.get('progresso')
    if progress is not None and not 0 <= progress <= 100:
        errors['progresso'] = 'O progresso deve estar entre 0 e 100.'

    for field in ('orcamento_aprovado', 'custo_atual'):
        value = attrs.get(field)
        if value is not None and value < 0:
            errors[field] = 'O valor nao pode ser negativo.'

    start = attrs.get('data_inicio')
    end = attrs.get('data_fim_prevista')
    if start and end and end < start:
        errors['data_fim_prevista'] = 'A data prevista de fim nao pode ser anterior a data de inicio.'

    if errors:
        raise serializers.ValidationError(errors)
    return attrs


def validate_money_payload(attrs, field='valor'):
    value = attrs.get(field)
    if value is not None and value < 0:
        raise serializers.ValidationError({field: 'O valor nao pode ser negativo.'})
    return attrs
