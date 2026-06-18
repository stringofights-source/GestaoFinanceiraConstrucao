from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notificacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(choices=[('pagamento_vencido', 'Pagamento vencido'), ('pagamento_pendente', 'Pagamento pendente'), ('desvio_orcamento', 'Desvio de orcamento')], max_length=40)),
                ('titulo', models.CharField(max_length=160)),
                ('mensagem', models.TextField()),
                ('origem_tipo', models.CharField(max_length=40)),
                ('origem_id', models.PositiveIntegerField()),
                ('lida', models.BooleanField(default=False)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('atualizado_em', models.DateTimeField(auto_now=True)),
                ('lida_em', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Notificacoes',
                'ordering': ['lida', '-criado_em'],
                'unique_together': {('tipo', 'origem_tipo', 'origem_id')},
            },
        ),
    ]
