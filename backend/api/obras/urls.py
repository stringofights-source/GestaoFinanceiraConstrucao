from rest_framework.routers import DefaultRouter

from api.obras.viewsets import ObraViewSet

router = DefaultRouter()
router.register('', ObraViewSet, basename='obras')

urlpatterns = router.urls
