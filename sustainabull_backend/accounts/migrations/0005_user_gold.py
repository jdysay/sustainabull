# Generated by Django 5.0.4 on 2025-04-02 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_remove_user_gold_alter_user_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='gold',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
