# Generated by Django 5.0.3 on 2024-05-14 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SNS', '0005_dontmind'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='created_at',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='post',
            name='user',
            field=models.CharField(max_length=20),
        ),
    ]
