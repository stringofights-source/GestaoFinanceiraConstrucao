from django.db import models

from api.notificacoes.managers import NotificacaoManager


class Notificacao(models.Model):
    TIPO_CHOICES = [
        ('pagamento_vencido', 'Pagamento vencido'),
        ('pagamento_pendente', 'Pagamento pendente'),
        ('desvio_orcamento', 'Desvio de orcamento'),
    ]

    tipo = models.CharField(max_length=40, choices=TIPO_CHOICES)
    titulo = models.CharField(max_length=160)
    mensagem = models.TextField()
    obra = models.ForeignKey(
        'obras.Obra',
        on_delete=models.CASCADE,
        related_name='notificacoes',
        null=True,
        blank=True,
    )
    fornecedor = models.ForeignKey(
        'fornecedores.Fornecedor',
        on_delete=models.CASCADE,
        related_name='notificacoes',
        null=True,
        blank=True,
    )
    lida = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    lida_em = models.DateTimeField(null=True, blank=True)

    objects = NotificacaoManager()

    class Meta:
        db_table = 'notificacoes'
        ordering = ['lida', '-criado_em']
        constraints = [
            models.UniqueConstraint(
                fields=['tipo', 'obra'],
                condition=models.Q(obra__isnull=False),
                name='unique_notificacao_obra',
            ),
            models.UniqueConstraint(
                fields=['tipo', 'fornecedor'],
                condition=models.Q(fornecedor__isnull=False),
                name='unique_notificacao_fornecedor',
            ),
            models.CheckConstraint(
                check=(
                    models.Q(obra__isnull=False, fornecedor__isnull=True)
                    | models.Q(obra__isnull=True, fornecedor__isnull=False)
                ),
                name='notificacao_exactly_one_source',
            ),
        ]
        verbose_name_plural = 'Notificacoes'
        indexes = [
            models.Index(fields=['lida', '-criado_em'], name='notif_lida_created_idx'),
        ]

    def __str__(self):
        return self.titulo

    @property
    def origem_tipo(self):
        if self.obra_id:
            return 'obra'
        if self.fornecedor_id:
            return 'fornecedor'
        return None

    @property
    def origem_id(self):
        return self.obra_id or self.fornecedor_id
