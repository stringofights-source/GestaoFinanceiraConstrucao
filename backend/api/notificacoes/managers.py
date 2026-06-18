from django.db import models


class NotificacaoManager(models.Manager):
    def upsert(self, tipo, origem_tipo, origem_id, titulo, mensagem):
        return self.update_or_create(
            tipo=tipo,
            origem_tipo=origem_tipo,
            origem_id=origem_id,
            defaults={
                'titulo': titulo,
                'mensagem': mensagem,
            },
        )

    def mark_all_read(self, now):
        return self.filter(lida=False).update(lida=True, lida_em=now)
