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
    origem_tipo = models.CharField(max_length=40)
    origem_id = models.PositiveIntegerField()
    lida = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    lida_em = models.DateTimeField(null=True, blank=True)

    objects = NotificacaoManager()

    class Meta:
        ordering = ['lida', '-criado_em']
        constraints = [
            models.UniqueConstraint(
                fields=['tipo', 'origem_tipo', 'origem_id'],
                name='unique_notificacao_origem',
            ),
        ]
        verbose_name_plural = 'Notificacoes'
        indexes = [
            models.Index(fields=['lida', '-criado_em'], name='notif_lida_created_idx'),
            models.Index(fields=['origem_tipo', 'origem_id'], name='notif_origem_idx'),
        ]

    def __str__(self):
        return self.titulo
