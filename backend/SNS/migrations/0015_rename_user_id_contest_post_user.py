# Generated by Django 5.0.6 on 2024-05-18 08:35

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("SNS", "0014_alter_vote_post"),
    ]

    operations = [
        migrations.RenameField(
            model_name="contest_post",
            old_name="user_id",
            new_name="user",
        ),
    ]
