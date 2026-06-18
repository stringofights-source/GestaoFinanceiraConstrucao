from django.db import models

from api.fornecedores.managers import FornecedorManager
from api.obras.models import Obra


class Fornecedor(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('pago', 'Pago'),
        ('atrasado', 'Atrasado'),
        ('agendado', 'Agendado'),
    ]

    nome = models.CharField(max_length=255)
    servico = models.CharField(max_length=255)
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, related_name='fornecedores', null=True, blank=True)
    prazo_pagamento = models.DateField()
    valor = models.DecimalField(max_digits=14, decimal_places=2)
    status_pagamento = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    criado_em = models.DateTimeField(auto_now_add=True)

    objects = FornecedorManager()

    class Meta:
        ordering = ['prazo_pagamento']
        verbose_name_plural = 'Fornecedores'
        indexes = [
            models.Index(fields=['status_pagamento', 'prazo_pagamento'], name='forn_status_prazo_idx'),
            models.Index(fields=['obra', 'prazo_pagamento'], name='forn_obra_prazo_idx'),
        ]
        constraints = [
            models.CheckConstraint(check=models.Q(valor__gte=0), name='fornecedor_valor_non_negative'),
        ]

    def __str__(self):
        return f'{self.nome} - EUR {self.valor}'
