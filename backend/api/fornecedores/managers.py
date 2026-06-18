from django.db import models
from django.db.models import Sum


class FornecedorQuerySet(models.QuerySet):
    def with_obra(self):
        return self.select_related('obra')

    def open_payments(self):
        return self.exclude(status_pagamento='pago')

    def overdue(self, today):
        return self.open_payments().filter(prazo_pagamento__lt=today)

    def pending_until(self, today, limit):
        return self.open_payments().filter(
            prazo_pagamento__gte=today,
            prazo_pagamento__lte=limit,
        )


class FornecedorManager(models.Manager.from_queryset(FornecedorQuerySet)):
    def with_obra(self):
        return self.get_queryset().with_obra()

    def open_payments(self):
        return self.with_obra().open_payments()

    def overdue(self, today):
        return self.with_obra().overdue(today)

    def pending_until(self, today, limit):
        return self.with_obra().pending_until(today, limit)

    def overdue_total(self):
        return (
            self.get_queryset()
            .filter(status_pagamento='atrasado')
            .aggregate(total=Sum('valor'))['total']
            or 0
        )
