from django.db import models


class Obra(models.Model):
    """Represents a construction project/work."""
    
    STATUS_CHOICES = [
        ('em_curso', 'Em Curso'),
        ('concluida', 'Concluída'),
        ('suspensa', 'Suspensa'),
        ('planeada', 'Planeada'),
    ]

    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, default='')
    orcamento_aprovado = models.DecimalField(max_digits=14, decimal_places=2)
    custo_atual = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    progresso = models.IntegerField(default=0, help_text='Percentagem de progresso (0-100)')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planeada')
    data_inicio = models.DateField()
    data_fim_prevista = models.DateField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name_plural = 'Obras'

    def __str__(self):
        return f'{self.nome} (#{self.pk})'

    @property
    def desvio(self):
        """Returns budget deviation amount."""
        return self.orcamento_aprovado - self.custo_atual

    @property
    def percentagem_orcamento(self):
        """Returns % of budget consumed."""
        if self.orcamento_aprovado == 0:
            return 0
        return round((self.custo_atual / self.orcamento_aprovado) * 100, 1)


class Transacao(models.Model):
    """Represents a financial transaction (cash flow entry/exit)."""
    
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('saida', 'Saída'),
    ]

    CATEGORIA_CHOICES = [
        ('clientes', 'Clientes'),
        ('materiais', 'Materiais'),
        ('mao_de_obra', 'Mão de Obra'),
        ('subcontratados', 'Subcontratados'),
        ('equipamentos', 'Equipamentos'),
        ('licencas', 'Licenças/Taxas'),
        ('outros', 'Outros'),
    ]

    descricao = models.CharField(max_length=255)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    valor = models.DecimalField(max_digits=14, decimal_places=2)
    categoria = models.CharField(max_length=20, choices=CATEGORIA_CHOICES, default='outros')
    data = models.DateField()
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, related_name='transacoes', null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-data', '-criado_em']
        verbose_name_plural = 'Transações'

    def __str__(self):
        sinal = '+' if self.tipo == 'entrada' else '-'
        return f'{sinal} €{self.valor} — {self.descricao}'


class Fornecedor(models.Model):
    """Represents a supplier or subcontractor payment."""
    
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('pago', 'Pago'),
        ('atrasado', 'Atrasado'),
        ('agendado', 'Agendado'),
    ]

    nome = models.CharField(max_length=255)
    servico = models.CharField(max_length=255)
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, related_name='fornecedores', null=True, blank=True)
    prazo_pagamento = models.DateField()
    valor = models.DecimalField(max_digits=14, decimal_places=2)
    status_pagamento = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['prazo_pagamento']
        verbose_name_plural = 'Fornecedores'

    def __str__(self):
        return f'{self.nome} — €{self.valor}'


class PrevisaoFinanceira(models.Model):
    """Monthly financial forecast record."""
    
    mes = models.CharField(max_length=20, help_text='Ex: Abr 2026')
    recebimentos_previstos = models.DecimalField(max_digits=14, decimal_places=2)
    pagamentos_previstos = models.DecimalField(max_digits=14, decimal_places=2)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['pk']
        verbose_name_plural = 'Previsões Financeiras'

    def __str__(self):
        return f'Previsão {self.mes}'
