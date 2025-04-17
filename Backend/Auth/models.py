from django.contrib.auth.models import AbstractUser
from django.db import models

class UserAbstract(AbstractUser):
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    blood_pressure = models.CharField(max_length=10, null=True, blank=True)
    cholesterol_level = models.CharField(max_length=10, null=True, blank=True)
    is_doctor = models.BooleanField(default=False)
    specialization = models.CharField(max_length=100, null=True, blank=True)
    workplace = models.CharField(max_length=100, null=True, blank=True)
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='auth_user_groups',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='auth_user_permissions',
        blank=True,
    )
    
    def __str__(self):
        return self.username
     