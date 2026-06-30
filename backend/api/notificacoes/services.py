from datetime import timedelta

from django.utils import timezone

from api.fornecedores.models import Fornecedor
from api.notificacoes.models import Notificacao
from api.obras.models import Obra


class NotificationService:
    @staticmethod
    def sync(today=None):
        today = today or timezone.now().date()
        pending_limit = today + timedelta(days=7)

        for supplier in Fornecedor.objects.overdue(today):
            Notificacao.objects.upsert_fornecedor(
                tipo='pagamento_vencido',
                fornecedor=supplier,
                titulo=f'Pagamento vencido: {supplier.nome}',
                mensagem=(
                    f'O pagamento de {supplier.valor} EUR a {supplier.nome} '
                    f'venceu em {supplier.prazo_pagamento}.'
                ),
            )

        for supplier in Fornecedor.objects.pending_until(today, pending_limit):
            Notificacao.objects.upsert_fornecedor(
                tipo='pagamento_pendente',
                fornecedor=supplier,
                titulo=f'Pagamento pendente: {supplier.nome}',
                mensagem=(
                    f'O pagamento de {supplier.valor} EUR a {supplier.nome} '
                    f'esta previsto para {supplier.prazo_pagamento}.'
                ),
            )

        for work in Obra.objects.over_budget():
            Notificacao.objects.upsert_obra(
                tipo='desvio_orcamento',
                obra=work,
                titulo=f'Desvio de orcamento: {work.nome}',
                mensagem=(
                    f'A obra {work.nome} tem custo atual de {work.custo_atual} EUR, '
                    f'acima do orcamento aprovado de {work.orcamento_aprovado} EUR.'
                ),
            )

    @staticmethod
    def mark_read(notification):
        notification.lida = True
        notification.lida_em = timezone.now()
        notification.save(update_fields=['lida', 'lida_em', 'atualizado_em'])
        return notification

    @staticmethod
    def mark_all_read():
        return Notificacao.objects.mark_all_read(timezone.now())
