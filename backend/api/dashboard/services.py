from datetime import timedelta

from django.db.models import Sum
from django.utils import timezone

from api.financeiro.models import Transacao
from api.fornecedores.models import Fornecedor


class DashboardService:
    @staticmethod
    def get_stats(today=None):
        today = today or timezone.now().date()
        month_start = today.replace(day=1)

        monthly_income = Transacao.objects.total_by_tipo('entrada', month_start, today)
        monthly_expenses = Transacao.objects.total_by_tipo('saida', month_start, today)
        total_income = Transacao.objects.total_by_tipo('entrada')
        total_expenses = Transacao.objects.total_by_tipo('saida')

        return {
            'receitas_mes': float(monthly_income),
            'despesas_mes': float(monthly_expenses),
            'saldo_atual': float(total_income - total_expenses),
            'meses_data': DashboardService._last_six_months(today),
            'custos_categoria': list(Transacao.objects.costs_by_category()),
            'pagamentos_vencidos': float(Fornecedor.objects.overdue_total(today)),
        }

    @staticmethod
    def _last_six_months(today):
        month_ranges = DashboardService._month_ranges(today, 6)
        first_start = month_ranges[0][0]
        last_end = month_ranges[-1][1]

        rows = (
            Transacao.objects.filter(data__gte=first_start, data__lte=last_end)
            .values('tipo', 'data__year', 'data__month')
            .annotate(total=Sum('valor'))
        )

        totals = {
            (row['data__year'], row['data__month'], row['tipo']): row['total']
            for row in rows
        }

        data = []
        for start, end in month_ranges:
            income = totals.get((start.year, start.month, 'entrada'), 0)
            expenses = totals.get((start.year, start.month, 'saida'), 0)
            data.append({
                'label': start.strftime('%b %Y'),
                'receitas': float(income),
                'despesas': float(expenses),
                'margem': float(income - expenses),
            })
        return data

    @staticmethod
    def _month_ranges(today, months):
        current = today.replace(day=1)
        starts = []
        for _ in range(months):
            starts.append(current)
            current = DashboardService._previous_month(current)
        starts.reverse()
        return [(start, DashboardService._month_end(start)) for start in starts]

    @staticmethod
    def _previous_month(value):
        if value.month == 1:
            return value.replace(year=value.year - 1, month=12)
        return value.replace(month=value.month - 1)

    @staticmethod
    def _month_end(value):
        if value.month == 12:
            return value.replace(year=value.year + 1, month=1, day=1) - timedelta(days=1)
        return value.replace(month=value.month + 1, day=1) - timedelta(days=1)
