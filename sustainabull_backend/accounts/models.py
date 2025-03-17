from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)  # Ensure email uniqueness
    username = models.CharField(unique=True,max_length=150)

    def __str__(self):
        return self.username