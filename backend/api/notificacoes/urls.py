from rest_framework.routers import DefaultRouter

from api.notificacoes.viewsets import NotificacaoViewSet

router = DefaultRouter()
router.register('', NotificacaoViewSet, basename='notificacoes')

urlpatterns = router.urls
