from django.db import models


class ObraQuerySet(models.QuerySet):
    def over_budget(self):
        return self.filter(custo_atual__gt=models.F('orcamento_aprovado'))


class ObraManager(models.Manager.from_queryset(ObraQuerySet)):
    pass
