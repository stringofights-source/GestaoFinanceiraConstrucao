from django.urls import include, path

from api.views import health_check

urlpatterns = [
    path('health/', health_check, name='health'),
    path('auth/', include('api.accounts.urls')),
    path('dashboard/', include('api.dashboard.urls')),
    path('', include('api.financeiro.urls')),
    path('fornecedores/', include('api.fornecedores.urls')),
    path('notificacoes/', include('api.notificacoes.urls')),
    path('obras/', include('api.obras.urls')),
]
