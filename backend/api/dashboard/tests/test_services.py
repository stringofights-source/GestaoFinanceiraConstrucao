from datetime import date
from decimal import Decimal

from django.test import TestCase

from api.dashboard.services import DashboardService
from api.financeiro.models import Transacao
from api.fornecedores.models import Fornecedor


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

    def test_counts_open_overdue_payments_by_due_date(self):
        today = date(2026, 6, 18)
        Fornecedor.objects.create(
            nome='Fornecedor vencido',
            servico='Materiais',
            prazo_pagamento=date(2026, 6, 17),
            valor=Decimal('125.00'),
            status_pagamento='pendente',
        )
        Fornecedor.objects.create(
            nome='Fornecedor pago',
            servico='Materiais',
            prazo_pagamento=date(2026, 6, 16),
            valor=Decimal('500.00'),
            status_pagamento='pago',
        )

        stats = DashboardService.get_stats(today=today)

        self.assertEqual(stats['pagamentos_vencidos'], 125.0)
