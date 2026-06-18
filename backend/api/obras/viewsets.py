from django.db.models import Q
from rest_framework import viewsets

from api.obras.models import Obra
from api.obras.serializers import ObraSerializer
from api.service.permissions import IsAuthenticatedForWriteOrReadOnly


class ObraViewSet(viewsets.ModelViewSet):
    serializer_class = ObraSerializer
    permission_classes = [IsAuthenticatedForWriteOrReadOnly]

    def get_queryset(self):
        queryset = Obra.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(Q(nome__icontains=search) | Q(descricao__icontains=search))
        return queryset
