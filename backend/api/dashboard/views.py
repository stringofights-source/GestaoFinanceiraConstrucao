from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.dashboard.services import DashboardService


@api_view(['GET'])
def dashboard_stats(request):
    return Response(DashboardService.get_stats())
