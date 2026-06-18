from datetime import date

from django.test import TestCase

from api.obras.serializers import ObraSerializer


class ObraSerializerTests(TestCase):
    def test_rejects_invalid_progress(self):
        serializer = ObraSerializer(data={
            'nome': 'Obra Teste',
            'orcamento_aprovado': '1000.00',
            'custo_atual': '100.00',
            'progresso': 120,
            'status': 'planeada',
            'data_inicio': date.today(),
        })

        self.assertFalse(serializer.is_valid())
        self.assertIn('progresso', serializer.errors)

    def test_rejects_end_date_before_start_date(self):
        serializer = ObraSerializer(data={
            'nome': 'Obra Teste',
            'orcamento_aprovado': '1000.00',
            'custo_atual': '100.00',
            'progresso': 10,
            'status': 'planeada',
            'data_inicio': '2026-06-10',
            'data_fim_prevista': '2026-06-01',
        })

        self.assertFalse(serializer.is_valid())
        self.assertIn('data_fim_prevista', serializer.errors)
