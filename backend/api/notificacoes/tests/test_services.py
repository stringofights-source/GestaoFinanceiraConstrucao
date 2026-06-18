from datetime import date, timedelta
from decimal import Decimal

from django.test import TestCase

from api.fornecedores.models import Fornecedor
from api.notificacoes.models import Notificacao
from api.notificacoes.services import NotificationService
from api.obras.models import Obra


class NotificationServiceTests(TestCase):
    def test_sync_creates_supplier_and_budget_notifications(self):
        today = date(2026, 6, 18)
        obra = Obra.objects.create(
            nome='Obra acima do orcamento',
            orcamento_aprovado=Decimal('100.00'),
            custo_atual=Decimal('120.00'),
            progresso=50,
            status='em_curso',
            data_inicio=today,
        )
        Fornecedor.objects.create(
            nome='Fornecedor vencido',
            servico='Materiais',
            obra=obra,
            prazo_pagamento=today - timedelta(days=1),
            valor=Decimal('10.00'),
            status_pagamento='pendente',
        )

        NotificationService.sync(today=today)

        self.assertTrue(Notificacao.objects.filter(tipo='pagamento_vencido').exists())
        self.assertTrue(Notificacao.objects.filter(tipo='desvio_orcamento').exists())
