from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from api.service.health import HealthService


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    payload = HealthService.status()
    response_status = (
        status.HTTP_200_OK
        if HealthService.is_healthy(payload)
        else status.HTTP_503_SERVICE_UNAVAILABLE
    )
    return Response(payload, status=response_status)
