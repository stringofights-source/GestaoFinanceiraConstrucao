from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta

from .models import Obra, Transacao, Fornecedor, PrevisaoFinanceira
from .serializers import (
    ObraSerializer,
    TransacaoSerializer,
    FornecedorSerializer,
    PrevisaoFinanceiraSerializer,
    UserSerializer,
)


# ─── User Registration (public) ───
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """Register a new user account."""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'message': 'Utilizador criado com sucesso!', 'user': serializer.data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Dashboard Aggregated Stats (authenticated) ───
@api_view(['GET'])
def dashboard_stats(request):
    """Return aggregated statistics for the dashboard."""
    hoje = timezone.now().date()
    inicio_mes = hoje.replace(day=1)

    # Monthly totals
    receitas_mes = Transacao.objects.filter(
        tipo='entrada', data__gte=inicio_mes, data__lte=hoje
    ).aggregate(total=Sum('valor'))['total'] or 0

    despesas_mes = Transacao.objects.filter(
        tipo='saida', data__gte=inicio_mes, data__lte=hoje
    ).aggregate(total=Sum('valor'))['total'] or 0

    # Last 6 months data for chart
    meses_data = []
    for i in range(5, -1, -1):
        d = hoje - timedelta(days=i * 30)
        m_inicio = d.replace(day=1)
        if d.month == 12:
            m_fim = d.replace(year=d.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            m_fim = d.replace(month=d.month + 1, day=1) - timedelta(days=1)

        rec = Transacao.objects.filter(
            tipo='entrada', data__gte=m_inicio, data__lte=m_fim
        ).aggregate(total=Sum('valor'))['total'] or 0
        desp = Transacao.objects.filter(
            tipo='saida', data__gte=m_inicio, data__lte=m_fim
        ).aggregate(total=Sum('valor'))['total'] or 0

        meses_data.append({
            'label': m_inicio.strftime('%b %Y'),
            'receitas': float(rec),
            'despesas': float(desp),
            'margem': float(rec - desp),
        })

    # Cost breakdown by category
    categorias = Transacao.objects.filter(tipo='saida').values('categoria').annotate(
        total=Sum('valor')
    ).order_by('-total')

    # Overdue supplier payments
    pagamentos_vencidos = Fornecedor.objects.filter(
        status_pagamento='atrasado'
    ).aggregate(total=Sum('valor'))['total'] or 0

    # Total balance
    total_entradas = Transacao.objects.filter(tipo='entrada').aggregate(total=Sum('valor'))['total'] or 0
    total_saidas = Transacao.objects.filter(tipo='saida').aggregate(total=Sum('valor'))['total'] or 0
    saldo = float(total_entradas) - float(total_saidas)

    return Response({
        'receitas_mes': float(receitas_mes),
        'despesas_mes': float(despesas_mes),
        'saldo_atual': saldo,
        'meses_data': meses_data,
        'custos_categoria': list(categorias),
        'pagamentos_vencidos': float(pagamentos_vencidos),
    })


# ─── Model ViewSets (CRUD) ───
class ObraViewSet(viewsets.ModelViewSet):
    queryset = Obra.objects.all()
    serializer_class = ObraSerializer


class TransacaoViewSet(viewsets.ModelViewSet):
    queryset = Transacao.objects.all()
    serializer_class = TransacaoSerializer


class FornecedorViewSet(viewsets.ModelViewSet):
    queryset = Fornecedor.objects.all()
    serializer_class = FornecedorSerializer


class PrevisaoFinanceiraViewSet(viewsets.ModelViewSet):
    queryset = PrevisaoFinanceira.objects.all()
    serializer_class = PrevisaoFinanceiraSerializer
