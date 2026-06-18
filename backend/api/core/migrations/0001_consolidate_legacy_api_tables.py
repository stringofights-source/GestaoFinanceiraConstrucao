from django.db import migrations


CANONICAL_TABLES = (
    {
        'legacy': 'api_obra',
        'canonical': 'obras_obra',
        'columns': {
            'id': ['id'],
            'nome': ['nome'],
            'descricao': ['descricao'],
            'orcamento_aprovado': ['orcamento_aprovado'],
            'custo_atual': ['custo_atual'],
            'progresso': ['progresso'],
            'status': ['status'],
            'data_inicio': ['data_inicio'],
            'data_fim_prevista': ['data_fim_prevista'],
            'criado_em': ['criado_em', 'created_at'],
            'atualizado_em': ['atualizado_em', 'updated_at'],
        },
        'defaults': {
            'descricao': "''",
            'orcamento_aprovado': '0',
            'custo_atual': '0',
            'progresso': '0',
            'status': "'planeada'",
            'data_inicio': 'CURRENT_DATE',
            'criado_em': 'NOW()',
            'atualizado_em': 'NOW()',
        },
        'duplicate_check': "LOWER(target.nome) = LOWER(src.nome) AND target.data_inicio = {data_inicio}",
    },
    {
        'legacy': 'api_previsaofinanceira',
        'canonical': 'financeiro_previsaofinanceira',
        'columns': {
            'id': ['id'],
            'mes': ['mes'],
            'recebimentos_previstos': ['recebimentos_previstos'],
            'pagamentos_previstos': ['pagamentos_previstos'],
            'criado_em': ['criado_em', 'created_at'],
        },
        'defaults': {
            'mes': "'Sem mes'",
            'recebimentos_previstos': '0',
            'pagamentos_previstos': '0',
            'criado_em': 'NOW()',
        },
        'duplicate_check': "target.mes = {mes}",
    },
    {
        'legacy': 'api_fornecedor',
        'canonical': 'fornecedores_fornecedor',
        'columns': {
            'id': ['id'],
            'nome': ['nome'],
            'servico': ['servico'],
            'obra_id': ['obra_id'],
            'prazo_pagamento': ['prazo_pagamento'],
            'valor': ['valor'],
            'status_pagamento': ['status_pagamento'],
            'criado_em': ['criado_em', 'created_at'],
        },
        'defaults': {
            'servico': "''",
            'prazo_pagamento': 'CURRENT_DATE',
            'valor': '0',
            'status_pagamento': "'pendente'",
            'criado_em': 'NOW()',
        },
        'foreign_keys': {
            'obra_id': ('obras_obra', 'id'),
        },
        'duplicate_check': (
            "LOWER(target.nome) = LOWER(src.nome) "
            "AND target.servico = {servico} "
            "AND target.prazo_pagamento = {prazo_pagamento} "
            "AND target.valor = {valor}"
        ),
    },
    {
        'legacy': 'api_transacao',
        'canonical': 'financeiro_transacao',
        'columns': {
            'id': ['id'],
            'descricao': ['descricao'],
            'tipo': ['tipo'],
            'valor': ['valor'],
            'categoria': ['categoria'],
            'data': ['data'],
            'obra_id': ['obra_id'],
            'criado_em': ['criado_em', 'created_at'],
        },
        'defaults': {
            'descricao': "''",
            'tipo': "'saida'",
            'valor': '0',
            'categoria': "'outros'",
            'data': 'CURRENT_DATE',
            'criado_em': 'NOW()',
        },
        'foreign_keys': {
            'obra_id': ('obras_obra', 'id'),
        },
        'duplicate_check': (
            "target.descricao = {descricao} "
            "AND target.tipo = {tipo} "
            "AND target.valor = {valor} "
            "AND target.categoria = {categoria} "
            "AND target.data = {data}"
        ),
    },
    {
        'legacy': 'api_notificacao',
        'canonical': 'notificacoes_notificacao',
        'columns': {
            'id': ['id'],
            'tipo': ['tipo'],
            'titulo': ['titulo'],
            'mensagem': ['mensagem'],
            'origem_tipo': ['origem_tipo'],
            'origem_id': ['origem_id'],
            'lida': ['lida'],
            'criado_em': ['criado_em', 'created_at'],
            'atualizado_em': ['atualizado_em', 'updated_at'],
            'lida_em': ['lida_em'],
        },
        'defaults': {
            'tipo': "'pagamento_pendente'",
            'titulo': "''",
            'mensagem': "''",
            'origem_tipo': "'legacy'",
            'origem_id': '0',
            'lida': 'FALSE',
            'criado_em': 'NOW()',
            'atualizado_em': 'NOW()',
        },
        'duplicate_check': (
            "target.tipo = {tipo} "
            "AND target.origem_tipo = {origem_tipo} "
            "AND target.origem_id = {origem_id}"
        ),
    },
)


def quote_name(connection, name):
    return connection.ops.quote_name(name)


def table_columns(connection, table_name):
    with connection.cursor() as cursor:
        return {
            column.name
            for column in connection.introspection.get_table_description(cursor, table_name)
        }


def column_expression(config, canonical_column, source_columns, legacy_columns, connection):
    for source_column in source_columns:
        if source_column in legacy_columns:
            expression = f'src.{quote_name(connection, source_column)}'
            break
    else:
        expression = config.get('defaults', {}).get(canonical_column, 'NULL')

    foreign_key = config.get('foreign_keys', {}).get(canonical_column)
    if not foreign_key:
        return expression

    foreign_table, foreign_column = foreign_key
    return (
        f'CASE WHEN {expression} IS NOT NULL AND EXISTS ('
        f'SELECT 1 FROM {quote_name(connection, foreign_table)} fk '
        f'WHERE fk.{quote_name(connection, foreign_column)} = {expression}'
        f') THEN {expression} ELSE NULL END'
    )


def consolidate_table(connection, config):
    existing_tables = set(connection.introspection.table_names())
    legacy = config['legacy']
    canonical = config['canonical']

    if legacy not in existing_tables or canonical not in existing_tables:
        return

    legacy_columns = table_columns(connection, legacy)
    canonical_columns = table_columns(connection, canonical)
    copy_columns = [
        column for column in config['columns']
        if column in canonical_columns and (column in config.get('defaults', {}) or any(src in legacy_columns for src in config['columns'][column]))
    ]

    if not copy_columns:
        return

    expressions = {
        column: column_expression(config, column, config['columns'][column], legacy_columns, connection)
        for column in copy_columns
    }
    insert_columns = ', '.join(quote_name(connection, column) for column in copy_columns)
    select_columns = ', '.join(f'{expressions[column]} AS {quote_name(connection, column)}' for column in copy_columns)

    duplicate_check = config.get('duplicate_check', '')
    for column, expression in expressions.items():
        duplicate_check = duplicate_check.replace('{' + column + '}', expression)

    duplicate_filter = ''
    if duplicate_check:
        duplicate_filter = (
            f'AND NOT EXISTS ('
            f'SELECT 1 FROM {quote_name(connection, canonical)} target '
            f'WHERE {duplicate_check}'
            f')'
        )

    with connection.cursor() as cursor:
        cursor.execute(
            f'''
            INSERT INTO {quote_name(connection, canonical)} ({insert_columns})
            SELECT {select_columns}
            FROM {quote_name(connection, legacy)} src
            WHERE NOT EXISTS (
                SELECT 1
                FROM {quote_name(connection, canonical)} target
                WHERE target.id = src.id
            )
            {duplicate_filter}
            ON CONFLICT DO NOTHING
            '''
        )
        if 'id' in canonical_columns:
            cursor.execute(
                'SELECT setval(pg_get_serial_sequence(%s, %s), '
                f'COALESCE((SELECT MAX(id) FROM {quote_name(connection, canonical)}), 1), true)',
                [canonical, 'id'],
            )


def archive_legacy_table(connection, table_name):
    existing_tables = set(connection.introspection.table_names())
    if table_name not in existing_tables:
        return

    archive_name = f'legacy_{table_name}'
    if archive_name in existing_tables:
        return

    with connection.cursor() as cursor:
        cursor.execute(
            f'ALTER TABLE {quote_name(connection, table_name)} '
            f'RENAME TO {quote_name(connection, archive_name)}'
        )


def forwards(apps, schema_editor):
    connection = schema_editor.connection
    if connection.vendor != 'postgresql':
        return

    for config in CANONICAL_TABLES:
        consolidate_table(connection, config)

    for config in reversed(CANONICAL_TABLES):
        archive_legacy_table(connection, config['legacy'])


def backwards(apps, schema_editor):
    connection = schema_editor.connection
    if connection.vendor != 'postgresql':
        return

    existing_tables = set(connection.introspection.table_names())
    with connection.cursor() as cursor:
        for config in CANONICAL_TABLES:
            legacy = config['legacy']
            archive = f'legacy_{legacy}'
            if archive in existing_tables and legacy not in existing_tables:
                cursor.execute(
                    f'ALTER TABLE {quote_name(connection, archive)} '
                    f'RENAME TO {quote_name(connection, legacy)}'
                )


class Migration(migrations.Migration):

    dependencies = [
        ('obras', '0001_initial'),
        ('financeiro', '0001_initial'),
        ('fornecedores', '0001_initial'),
        ('notificacoes', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
