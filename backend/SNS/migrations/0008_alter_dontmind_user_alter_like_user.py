# Generated by Django 5.0.3 on 2024-05-15 01:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SNS', '0007_alter_post_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dontmind',
            name='user',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='like',
            name='user',
            field=models.CharField(max_length=50),
        ),
    ]
