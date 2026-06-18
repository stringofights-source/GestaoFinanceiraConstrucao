from django.db.models import Q
from rest_framework import viewsets

from api.fornecedores.models import Fornecedor
from api.fornecedores.serializers import FornecedorSerializer
from api.service.permissions import IsAuthenticatedForWriteOrReadOnly


class FornecedorViewSet(viewsets.ModelViewSet):
    serializer_class = FornecedorSerializer
    permission_classes = [IsAuthenticatedForWriteOrReadOnly]

    def get_queryset(self):
        queryset = Fornecedor.objects.with_obra()
        search = self.request.query_params.get('search')
        status_filter = self.request.query_params.get('status')
        if search:
            queryset = queryset.filter(
                Q(nome__icontains=search)
                | Q(servico__icontains=search)
                | Q(obra__nome__icontains=search)
            )
        if status_filter and status_filter != 'todos':
            queryset = queryset.filter(status_pagamento=status_filter)
        return queryset
