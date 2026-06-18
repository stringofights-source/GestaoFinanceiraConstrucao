from django.test import TestCase

from api.financeiro.serializers import TransacaoSerializer


class TransacaoSerializerTests(TestCase):
    def test_rejects_negative_value(self):
        serializer = TransacaoSerializer(data={
            'descricao': 'Compra',
            'tipo': 'saida',
            'valor': '-1.00',
            'categoria': 'materiais',
            'data': '2026-06-01',
        })

        self.assertFalse(serializer.is_valid())
        self.assertIn('valor', serializer.errors)
