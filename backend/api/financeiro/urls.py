from rest_framework.routers import DefaultRouter

from api.financeiro.viewsets import PrevisaoFinanceiraViewSet, TransacaoViewSet

router = DefaultRouter()
router.register('transacoes', TransacaoViewSet, basename='transacoes')
router.register('previsoes', PrevisaoFinanceiraViewSet, basename='previsoes')

urlpatterns = router.urls
