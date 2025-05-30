# Generated by Django 5.0.4 on 2025-04-04 23:00

import django.contrib.auth.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_remove_inventoryitem_item_remove_inventoryitem_user_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShopItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_name', models.CharField(max_length=100)),
                ('item_type', models.CharField(max_length=20)),
                ('price', models.IntegerField()),
                ('effect_element', models.IntegerField()),
                ('effect_value', models.IntegerField(blank=True, null=True)),
                ('item_description', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='gold',
        ),
        migrations.AddField(
            model_name='user',
            name='coin',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='email address'),
        ),
        migrations.AlterField(
            model_name='user',
            name='first_name',
            field=models.CharField(blank=True, max_length=150, verbose_name='first name'),
        ),
        migrations.AlterField(
            model_name='user',
            name='last_name',
            field=models.CharField(blank=True, max_length=150, verbose_name='last name'),
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=128, verbose_name='password'),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username'),
        ),
        migrations.CreateModel(
            name='Cow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cow_name', models.CharField(max_length=100)),
                ('cow_level', models.IntegerField(default=1)),
                ('experience_points', models.IntegerField(default=0)),
                ('mood', models.IntegerField(default=100)),
                ('hunger', models.IntegerField(default=100)),
                ('co2_emissions', models.IntegerField(default=0)),
                ('exercise', models.IntegerField(default=0)),
                ('alive', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='cow', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Inventory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=1)),
                ('acquired_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inventory_items', to=settings.AUTH_USER_MODEL)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inventories', to='accounts.shopitem')),
            ],
        ),
        migrations.CreateModel(
            name='CowDecoration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('equipped_at', models.DateTimeField(auto_now_add=True)),
                ('cow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='decorations', to='accounts.cow')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cow_decorations', to='accounts.shopitem')),
            ],
        ),
        migrations.CreateModel(
            name='WalkLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('walked_at', models.DateTimeField(auto_now_add=True)),
                ('distance_m', models.FloatField()),
                ('route_geojson', models.JSONField(blank=True, null=True)),
                ('earned_coins', models.IntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='walk_logs', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddConstraint(
            model_name='cow',
            constraint=models.CheckConstraint(check=models.Q(('mood__gte', 0), ('mood__lte', 100)), name='mood_range'),
        ),
        migrations.AddConstraint(
            model_name='cow',
            constraint=models.CheckConstraint(check=models.Q(('hunger__gte', 0), ('hunger__lte', 100)), name='hunger_range'),
        ),
        migrations.AddConstraint(
            model_name='cow',
            constraint=models.CheckConstraint(check=models.Q(('co2_emissions__gte', 0), ('co2_emissions__lte', 100)), name='co2_range'),
        ),
    ]
