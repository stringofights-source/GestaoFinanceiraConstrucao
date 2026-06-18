from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from api.notificacoes.models import Notificacao
from api.notificacoes.serializers import NotificacaoSerializer
from api.notificacoes.services import NotificationService
from api.service.permissions import IsAuthenticatedForWriteOrReadOnly


class NotificacaoViewSet(viewsets.ModelViewSet):
    queryset = Notificacao.objects.all()
    serializer_class = NotificacaoSerializer
    permission_classes = [IsAuthenticatedForWriteOrReadOnly]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def create(self, request, *args, **kwargs):
        return Response(
            {'detail': 'Notificacoes sao geradas automaticamente.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(detail=False, methods=['post'])
    def sincronizar(self, request):
        NotificationService.sync()
        return Response({'message': 'Notificacoes sincronizadas.'})

    @action(detail=True, methods=['post'])
    def marcar_lida(self, request, pk=None):
        notification = NotificationService.mark_read(self.get_object())
        return Response(self.get_serializer(notification).data)

    @action(detail=False, methods=['post'])
    def marcar_todas_lidas(self, request):
        NotificationService.mark_all_read()
        return Response({'message': 'Notificacoes marcadas como lidas.'})
