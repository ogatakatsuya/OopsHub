# Generated by Django 5.0.3 on 2024-05-19 03:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SNS', '0022_alter_contest_post_user_alter_dontmind_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dontmind',
            name='user',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='learned',
            name='user',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='like',
            name='user',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='vote',
            name='user',
            field=models.CharField(max_length=100),
        ),
    ]
