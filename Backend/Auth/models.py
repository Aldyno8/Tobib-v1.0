from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    blood_pressure = models.IntegerField(null=True, blank=True)
    cholesterol_level = models.IntegerField(null=True, blank=True)    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='auth_user_groups',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='auth_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    def __str__(self):
        return self.username
    
    