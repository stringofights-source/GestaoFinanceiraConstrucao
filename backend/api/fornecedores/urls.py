from rest_framework.routers import DefaultRouter

from api.fornecedores.viewsets import FornecedorViewSet

router = DefaultRouter()
router.register('', FornecedorViewSet, basename='fornecedores')

urlpatterns = router.urls
