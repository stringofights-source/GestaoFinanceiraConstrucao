from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from api.service.health import HealthService


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    return Response(HealthService.status())
