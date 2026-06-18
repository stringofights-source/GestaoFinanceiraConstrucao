"""
Management command to populate the database with realistic demo data.
Usage: python manage.py seed_data
"""
import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Obra, Transacao, Fornecedor, PrevisaoFinanceira
from datetime import date, timedelta
from decimal import Decimal


class Command(BaseCommand):
    help = 'Popula a base de dados com dados de demonstração realistas.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users-only',
            action='store_true',
            help='Cria ou atualiza apenas os utilizadores demo configurados por env.',
        )

    def sync_user(self, username, email, password, first_name='', last_name='', is_superuser=False):
        if not password:
            role = 'superuser demo' if is_superuser else 'user demo'
            env_name = 'SEED_ADMIN_PASSWORD' if is_superuser else 'SEED_USER_PASSWORD'
            self.stdout.write(self.style.WARNING(f'[!] {env_name} nao definido; {role} nao foi criado/atualizado.'))
            return

        user = User.objects.filter(username=username).first()
        if user is None:
            if is_superuser:
                User.objects.create_superuser(username, email, password)
                self.stdout.write(self.style.SUCCESS(f'[+] Superuser "{username}" criado.'))
            else:
                User.objects.create_user(
                    username, email, password,
                    first_name=first_name, last_name=last_name
                )
                self.stdout.write(self.style.SUCCESS(f'[+] User "{username}" criado.'))
            return

        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        if is_superuser:
            user.is_staff = True
            user.is_superuser = True
        user.set_password(password)
        user.save()
        self.stdout.write(self.style.SUCCESS(f'[+] User "{username}" atualizado.'))

    def create_seed_users(self):
        admin_username = os.environ.get('SEED_ADMIN_USERNAME', 'admin')
        admin_email = os.environ.get('SEED_ADMIN_EMAIL', 'admin@construmanage.pt')
        admin_password = os.environ.get('SEED_ADMIN_PASSWORD')

        demo_username = os.environ.get('SEED_USER_USERNAME', 'davide')
        demo_email = os.environ.get('SEED_USER_EMAIL', 'davide@construmanage.pt')
        demo_password = os.environ.get('SEED_USER_PASSWORD')
        demo_first_name = os.environ.get('SEED_USER_FIRST_NAME', 'Davide')
        demo_last_name = os.environ.get('SEED_USER_LAST_NAME', 'Moreno')

        self.sync_user(admin_username, admin_email, admin_password, is_superuser=True)
        self.sync_user(demo_username, demo_email, demo_password, demo_first_name, demo_last_name)

    def handle(self, *args, **options):
        if options['users_only']:
            self.create_seed_users()
            return

        self.stdout.write('[*] A limpar dados antigos...')
        Transacao.objects.all().delete()
        Fornecedor.objects.all().delete()
        PrevisaoFinanceira.objects.all().delete()
        Obra.objects.all().delete()

        self.create_seed_users()

        # ─── OBRAS ───
        self.stdout.write('[*] A criar obras...')
        obra1 = Obra.objects.create(
            nome='Edifício Horizonte',
            descricao='Construção de edifício residencial de 8 andares no centro de Bragança.',
            orcamento_aprovado=Decimal('1500000.00'),
            custo_atual=Decimal('850000.00'),
            progresso=56,
            status='em_curso',
            data_inicio=date(2025, 6, 1),
            data_fim_prevista=date(2027, 3, 1),
        )
        obra2 = Obra.objects.create(
            nome='Moradia Silva',
            descricao='Moradia unifamiliar T4 com piscina em Mirandela.',
            orcamento_aprovado=Decimal('350000.00'),
            custo_atual=Decimal('365000.00'),
            progresso=92,
            status='em_curso',
            data_inicio=date(2025, 3, 15),
            data_fim_prevista=date(2026, 5, 30),
        )
        obra3 = Obra.objects.create(
            nome='Armazém Logístico Norte',
            descricao='Armazém industrial com área de 5000m² na zona industrial de Bragança.',
            orcamento_aprovado=Decimal('800000.00'),
            custo_atual=Decimal('200000.00'),
            progresso=25,
            status='em_curso',
            data_inicio=date(2026, 1, 10),
            data_fim_prevista=date(2027, 1, 10),
        )
        obra4 = Obra.objects.create(
            nome='Reabilitação Escola Municipal',
            descricao='Reabilitação energética e estrutural da Escola Básica de Vinhais.',
            orcamento_aprovado=Decimal('420000.00'),
            custo_atual=Decimal('0.00'),
            progresso=0,
            status='planeada',
            data_inicio=date(2026, 9, 1),
            data_fim_prevista=date(2027, 6, 30),
        )

        # ─── TRANSAÇÕES ───
        self.stdout.write('[*] A criar transacoes...')
        hoje = date.today()
        transacoes_data = [
            # Entradas (recebimentos de clientes)
            ('Fatura Adiantamento - Edifício Horizonte', 'entrada', 50000, 'clientes', 0, obra1),
            ('Pagamento 3ª tranche - Edifício Horizonte', 'entrada', 75000, 'clientes', 15, obra1),
            ('Fatura Final Fase 1 - Moradia Silva', 'entrada', 45000, 'clientes', 5, obra2),
            ('Adiantamento Armazém Norte', 'entrada', 80000, 'clientes', 20, obra3),
            ('Pagamento Autos Medição Fev - Horizonte', 'entrada', 120000, 'clientes', 35, obra1),
            ('Recebimento Cliente - Moradia Silva', 'entrada', 60000, 'clientes', 50, obra2),
            ('Fatura Adiantamento Armazém', 'entrada', 40000, 'clientes', 60, obra3),
            ('Pagamento Autos Medição Jan - Horizonte', 'entrada', 95000, 'clientes', 75, obra1),
            ('Recebimento fase estrutura - Moradia', 'entrada', 55000, 'clientes', 90, obra2),
            ('Pagamento Dez - Horizonte', 'entrada', 110000, 'clientes', 110, obra1),
            ('Pagamento Nov - Horizonte', 'entrada', 85000, 'clientes', 130, obra1),
            ('Pagamento Out - Horizonte', 'entrada', 70000, 'clientes', 150, obra1),
            # Saídas (custos)
            ('Compra de Cimento e Betão (Fatura AF-44)', 'saida', 8500, 'materiais', 1, obra1),
            ('Salários e Remunerações (Equipa Obra 01)', 'saida', 12300, 'mao_de_obra', 2, obra1),
            ('Compra de Aço e Ferro', 'saida', 22000, 'materiais', 8, obra1),
            ('Aluguer de Grua - Fevereiro', 'saida', 7500, 'equipamentos', 10, obra1),
            ('Pagamento Subcontratado Electricidade', 'saida', 15000, 'subcontratados', 12, obra2),
            ('Materiais de Acabamento - Moradia', 'saida', 18000, 'materiais', 18, obra2),
            ('Salários Equipa Obra 02', 'saida', 9800, 'mao_de_obra', 22, obra2),
            ('Licenças Camarárias - Armazém', 'saida', 3200, 'licencas', 25, obra3),
            ('Materiais Fundação - Armazém', 'saida', 35000, 'materiais', 30, obra3),
            ('Salários Equipa 01 - Janeiro', 'saida', 12300, 'mao_de_obra', 40, obra1),
            ('Seguro de Obra - Horizonte', 'saida', 4500, 'licencas', 45, obra1),
            ('Compra Materiais Impermeabilização', 'saida', 6200, 'materiais', 55, obra1),
            ('Aluguer Grua - Janeiro', 'saida', 7500, 'equipamentos', 65, obra1),
            ('Salários Equipa 02 - Janeiro', 'saida', 9500, 'mao_de_obra', 70, obra2),
            ('Subcontratado Canalização - Moradia', 'saida', 8000, 'subcontratados', 80, obra2),
            ('Compra Betão Dez - Horizonte', 'saida', 14000, 'materiais', 95, obra1),
            ('Salários Equipa - Dezembro', 'saida', 12000, 'mao_de_obra', 100, obra1),
            ('Aluguer Equipamentos - Dez', 'saida', 5500, 'equipamentos', 115, obra1),
            ('Materiais Nov - Horizonte', 'saida', 11000, 'materiais', 125, obra1),
            ('Salários Nov', 'saida', 12000, 'mao_de_obra', 135, obra1),
            ('Materiais Out', 'saida', 9000, 'materiais', 145, obra1),
            ('Salários Out', 'saida', 11500, 'mao_de_obra', 155, obra1),
        ]

        for desc, tipo, valor, cat, days_ago, obra in transacoes_data:
            Transacao.objects.create(
                descricao=desc,
                tipo=tipo,
                valor=Decimal(str(valor)),
                categoria=cat,
                data=hoje - timedelta(days=days_ago),
                obra=obra,
            )

        # ─── FORNECEDORES ───
        self.stdout.write('[*] A criar fornecedores...')
        Fornecedor.objects.create(
            nome='Irmãos Silva Betão, Lda.',
            servico='Fornecimento de Betão Pronto',
            obra=obra1,
            prazo_pagamento=date(2026, 3, 4),
            valor=Decimal('4250.00'),
            status_pagamento='atrasado',
        )
        Fornecedor.objects.create(
            nome='Electricidade Global SA',
            servico='Instalação de Quadro Elétrico',
            obra=obra2,
            prazo_pagamento=date(2026, 3, 10),
            valor=Decimal('2800.00'),
            status_pagamento='pendente',
        )
        Fornecedor.objects.create(
            nome='Maquinaria Pesada Renting',
            servico='Aluguer de Grua (Mês Fev)',
            obra=obra1,
            prazo_pagamento=date(2026, 3, 15),
            valor=Decimal('7500.00'),
            status_pagamento='pendente',
        )
        Fornecedor.objects.create(
            nome='Aço do Norte, SA',
            servico='Fornecimento de Aço e Armaduras',
            obra=obra3,
            prazo_pagamento=date(2026, 3, 20),
            valor=Decimal('11800.00'),
            status_pagamento='agendado',
        )
        Fornecedor.objects.create(
            nome='Cerâmica Transmontana',
            servico='Revestimentos Cerâmicos',
            obra=obra2,
            prazo_pagamento=date(2026, 2, 28),
            valor=Decimal('3600.00'),
            status_pagamento='pago',
        )

        # ─── PREVISÕES FINANCEIRAS ───
        self.stdout.write('[*] A criar previsoes financeiras...')
        previsoes = [
            ('Abr 2026', 300000, 200000),
            ('Mai 2026', 350000, 450000),
            ('Jun 2026', 400000, 420000),
            ('Jul 2026', 600000, 480000),
            ('Ago 2026', 650000, 500000),
            ('Set 2026', 800000, 520000),
        ]
        for mes, rec, pag in previsoes:
            PrevisaoFinanceira.objects.create(
                mes=mes,
                recebimentos_previstos=Decimal(str(rec)),
                pagamentos_previstos=Decimal(str(pag)),
            )

        self.stdout.write(self.style.SUCCESS(
            f'\n[OK] Seed concluido! Criados: '
            f'{Obra.objects.count()} obras, '
            f'{Transacao.objects.count()} transacoes, '
            f'{Fornecedor.objects.count()} fornecedores, '
            f'{PrevisaoFinanceira.objects.count()} previsoes.'
        ))
