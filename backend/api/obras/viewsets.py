from django.db.models import Q
from rest_framework import viewsets

from api.obras.models import Obra
from api.obras.serializers import ObraSerializer
from api.service.permissions import IsAuthenticatedForDataAccess
from api.service.viewsets import ProtectedDeleteMixin


class ObraViewSet(ProtectedDeleteMixin, viewsets.ModelViewSet):
    serializer_class = ObraSerializer
    permission_classes = [IsAuthenticatedForDataAccess]
    protected_delete_message = 'Esta obra tem transacoes ou fornecedores associados e nao pode ser eliminada.'

    def get_queryset(self):
        queryset = Obra.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(Q(nome__icontains=search) | Q(descricao__icontains=search))
        return queryset
