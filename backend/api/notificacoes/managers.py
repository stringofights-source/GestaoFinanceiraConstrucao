from django.db import models


class NotificacaoManager(models.Manager):
    def upsert_fornecedor(self, tipo, fornecedor, titulo, mensagem):
        return self.update_or_create(
            tipo=tipo,
            fornecedor=fornecedor,
            defaults={
                'titulo': titulo,
                'mensagem': mensagem,
                'obra': None,
            },
        )

    def upsert_obra(self, tipo, obra, titulo, mensagem):
        return self.update_or_create(
            tipo=tipo,
            obra=obra,
            defaults={
                'titulo': titulo,
                'mensagem': mensagem,
                'fornecedor': None,
            },
        )

    def mark_all_read(self, now):
        return self.filter(lida=False).update(lida=True, lida_em=now)
