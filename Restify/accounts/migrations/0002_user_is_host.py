# Generated by Django 4.1.7 on 2023-03-12 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_host',
            field=models.BooleanField(default=False),
        ),
    ]
