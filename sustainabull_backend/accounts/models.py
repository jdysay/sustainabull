from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)  # Ensure email uniqueness
    username = models.CharField(unique=True,max_length=150)
    gold = models.PositiveIntegerField(default=100)  # Start with 100 gold instead of 0
