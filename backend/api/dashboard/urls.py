from django.urls import path

from api.dashboard.views import dashboard_stats

urlpatterns = [
    path('', dashboard_stats, name='dashboard'),
]
