from django.db import models

from api.obras.managers import ObraManager


class Obra(models.Model):
    STATUS_CHOICES = [
        ('em_curso', 'Em Curso'),
        ('concluida', 'Concluida'),
        ('suspensa', 'Suspensa'),
        ('planeada', 'Planeada'),
    ]

    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, default='')
    orcamento_aprovado = models.DecimalField(max_digits=14, decimal_places=2)
    custo_atual = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    progresso = models.IntegerField(default=0, help_text='Percentagem de progresso (0-100)')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planeada')
    data_inicio = models.DateField()
    data_fim_prevista = models.DateField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    objects = ObraManager()

    class Meta:
        db_table = 'obras'
        ordering = ['-criado_em']
        verbose_name_plural = 'Obras'
        indexes = [
            models.Index(fields=['status', 'criado_em'], name='obra_status_created_idx'),
        ]
        constraints = [
            models.CheckConstraint(check=models.Q(orcamento_aprovado__gte=0), name='obra_orcamento_non_negative'),
            models.CheckConstraint(check=models.Q(custo_atual__gte=0), name='obra_custo_non_negative'),
            models.CheckConstraint(
                check=models.Q(progresso__gte=0) & models.Q(progresso__lte=100),
                name='obra_progresso_0_100',
            ),
            models.CheckConstraint(
                check=models.Q(data_fim_prevista__isnull=True) | models.Q(data_fim_prevista__gte=models.F('data_inicio')),
                name='obra_data_fim_after_inicio',
            ),
        ]

    def __str__(self):
        return f'{self.nome} (#{self.pk})'

    @property
    def desvio(self):
        return self.orcamento_aprovado - self.custo_atual

    @property
    def percentagem_orcamento(self):
        if self.orcamento_aprovado == 0:
            return 0
        return round((self.custo_atual / self.orcamento_aprovado) * 100, 1)
