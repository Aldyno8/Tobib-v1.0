from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    blood_pressure = models.IntegerField(null=True, blank=True)
    cholesterol_level = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return self.username
    
    