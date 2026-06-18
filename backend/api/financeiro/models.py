from django.db import models

from api.financeiro.managers import TransacaoManager
from api.obras.models import Obra


class Transacao(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('saida', 'Saida'),
    ]

    CATEGORIA_CHOICES = [
        ('clientes', 'Clientes'),
        ('materiais', 'Materiais'),
        ('mao_de_obra', 'Mao de Obra'),
        ('subcontratados', 'Subcontratados'),
        ('equipamentos', 'Equipamentos'),
        ('licencas', 'Licencas/Taxas'),
        ('outros', 'Outros'),
    ]

    descricao = models.CharField(max_length=255)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    valor = models.DecimalField(max_digits=14, decimal_places=2)
    categoria = models.CharField(max_length=20, choices=CATEGORIA_CHOICES, default='outros')
    data = models.DateField()
    obra = models.ForeignKey(Obra, on_delete=models.PROTECT, related_name='transacoes', null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    objects = TransacaoManager()

    class Meta:
        ordering = ['-data', '-criado_em']
        verbose_name_plural = 'Transacoes'
        indexes = [
            models.Index(fields=['tipo', 'data'], name='trans_tipo_data_idx'),
            models.Index(fields=['categoria', 'data'], name='trans_cat_data_idx'),
            models.Index(fields=['obra', 'data'], name='trans_obra_data_idx'),
            models.Index(fields=['data'], name='trans_data_idx'),
        ]
        constraints = [
            models.CheckConstraint(check=models.Q(valor__gte=0), name='transacao_valor_non_negative'),
        ]

    def __str__(self):
        signal = '+' if self.tipo == 'entrada' else '-'
        return f'{signal} EUR {self.valor} - {self.descricao}'


class PrevisaoFinanceira(models.Model):
    mes = models.CharField(max_length=20, unique=True, help_text='Ex: Abr 2026')
    recebimentos_previstos = models.DecimalField(max_digits=14, decimal_places=2)
    pagamentos_previstos = models.DecimalField(max_digits=14, decimal_places=2)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['pk']
        verbose_name_plural = 'Previsoes Financeiras'
        constraints = [
            models.CheckConstraint(
                check=models.Q(recebimentos_previstos__gte=0),
                name='previsao_recebimentos_non_negative',
            ),
            models.CheckConstraint(
                check=models.Q(pagamentos_previstos__gte=0),
                name='previsao_pagamentos_non_negative',
            ),
        ]

    def __str__(self):
        return f'Previsao {self.mes}'
