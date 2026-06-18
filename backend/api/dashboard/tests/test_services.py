from datetime import date
from decimal import Decimal

from django.test import TestCase

from api.dashboard.services import DashboardService
from api.financeiro.models import Transacao


class DashboardServiceTests(TestCase):
    def test_returns_aggregated_totals(self):
        today = date(2026, 6, 18)
        Transacao.objects.create(
            descricao='Receita',
            tipo='entrada',
            valor=Decimal('100.00'),
            categoria='clientes',
            data=today,
        )
        Transacao.objects.create(
            descricao='Despesa',
            tipo='saida',
            valor=Decimal('40.00'),
            categoria='materiais',
            data=today,
        )

        stats = DashboardService.get_stats(today=today)

        self.assertEqual(stats['receitas_mes'], 100.0)
        self.assertEqual(stats['despesas_mes'], 40.0)
        self.assertEqual(stats['saldo_atual'], 60.0)
