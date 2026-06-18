from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

router = DefaultRouter()
router.register(r'obras', views.ObraViewSet)
router.register(r'transacoes', views.TransacaoViewSet)
router.register(r'fornecedores', views.FornecedorViewSet)
router.register(r'previsoes', views.PrevisaoFinanceiraViewSet)
router.register(r'notificacoes', views.NotificacaoViewSet, basename='notificacoes')

urlpatterns = [
    # JWT Authentication
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', views.register_user, name='register'),
    # Dashboard
    path('dashboard/', views.dashboard_stats, name='dashboard'),
    # CRUD Routes
    path('', include(router.urls)),
]
