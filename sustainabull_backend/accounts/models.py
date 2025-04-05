from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    gold = models.IntegerField(default=0, null=False)
    # AbstractUserはすでにusername, email, password, first_name, last_nameを持っています

class WalkLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='walk_logs')
    walked_at = models.DateTimeField(auto_now_add=True)
    distance_m = models.FloatField()
    route_geojson = models.JSONField(null=True, blank=True)
    earned_coins = models.IntegerField()

class Cow(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cow')
    cow_name = models.CharField(max_length=100)
    cow_level = models.IntegerField(default=1)
    experience_points = models.IntegerField(default=0)
    mood = models.IntegerField(default=100)
    hunger = models.IntegerField(default=100)
    co2_emissions = models.IntegerField(default=0)
    exercise = models.IntegerField(default=0)
    alive = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(mood__gte=0, mood__lte=100), name='mood_range'),
            models.CheckConstraint(check=models.Q(hunger__gte=0, hunger__lte=100), name='hunger_range'),
            models.CheckConstraint(check=models.Q(co2_emissions__gte=0, co2_emissions__lte=100), name='co2_range'),
        ]

class ShopItem(models.Model):
    item_name = models.CharField(max_length=100)
    item_type = models.CharField(max_length=20)
    price = models.IntegerField()
    effect_element = models.IntegerField()
    effect_value = models.IntegerField(null=True, blank=True)
    item_description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Inventory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inventory_items')
    item = models.ForeignKey(ShopItem, on_delete=models.CASCADE, related_name='inventories')
    quantity = models.IntegerField(default=1)
    acquired_at = models.DateTimeField(auto_now_add=True)

class CowDecoration(models.Model):
    cow = models.ForeignKey(Cow, on_delete=models.CASCADE, related_name='decorations')
    item = models.ForeignKey(ShopItem, on_delete=models.CASCADE, related_name='cow_decorations')
    equipped_at = models.DateTimeField(auto_now_add=True)