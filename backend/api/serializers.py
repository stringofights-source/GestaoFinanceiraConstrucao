from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Obra, Transacao, Fornecedor, PrevisaoFinanceira


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ObraSerializer(serializers.ModelSerializer):
    desvio = serializers.ReadOnlyField()
    percentagem_orcamento = serializers.ReadOnlyField()

    class Meta:
        model = Obra
        fields = '__all__'


class TransacaoSerializer(serializers.ModelSerializer):
    obra_nome = serializers.CharField(source='obra.nome', read_only=True, default=None)

    class Meta:
        model = Transacao
        fields = '__all__'


class FornecedorSerializer(serializers.ModelSerializer):
    obra_nome = serializers.CharField(source='obra.nome', read_only=True, default=None)

    class Meta:
        model = Fornecedor
        fields = '__all__'


class PrevisaoFinanceiraSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrevisaoFinanceira
        fields = '__all__'
