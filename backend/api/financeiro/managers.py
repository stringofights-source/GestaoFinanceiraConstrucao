from django.db import models
from django.db.models import Sum


class TransacaoQuerySet(models.QuerySet):
    def with_obra(self):
        return self.select_related('obra')

    def between_dates(self, start=None, end=None):
        queryset = self
        if start:
            queryset = queryset.filter(data__gte=start)
        if end:
            queryset = queryset.filter(data__lte=end)
        return queryset


class TransacaoManager(models.Manager.from_queryset(TransacaoQuerySet)):
    def with_obra(self):
        return self.get_queryset().with_obra()

    def total_by_tipo(self, tipo, start=None, end=None):
        return (
            self.get_queryset()
            .filter(tipo=tipo)
            .between_dates(start, end)
            .aggregate(total=Sum('valor'))['total']
            or 0
        )

    def costs_by_category(self):
        return (
            self.get_queryset()
            .filter(tipo='saida')
            .values('categoria')
            .annotate(total=Sum('valor'))
            .order_by('-total')
        )
