from django.db.models import Q
from rest_framework import viewsets

from api.financeiro.models import PrevisaoFinanceira, Transacao
from api.financeiro.serializers import PrevisaoFinanceiraSerializer, TransacaoSerializer
from api.service.permissions import IsAuthenticatedForDataAccess


class TransacaoViewSet(viewsets.ModelViewSet):
    serializer_class = TransacaoSerializer
    permission_classes = [IsAuthenticatedForDataAccess]

    def get_queryset(self):
        queryset = Transacao.objects.with_obra()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(descricao__icontains=search)
                | Q(categoria__icontains=search)
                | Q(tipo__icontains=search)
                | Q(obra__nome__icontains=search)
            )
        return queryset


class PrevisaoFinanceiraViewSet(viewsets.ModelViewSet):
    queryset = PrevisaoFinanceira.objects.all()
    serializer_class = PrevisaoFinanceiraSerializer
    permission_classes = [IsAuthenticatedForDataAccess]
