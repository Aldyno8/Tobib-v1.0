from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    age = models.IntegerField(blank=True, null=True, default=0)
    sex = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')], blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    smoker = models.CharField(max_length=3, choices=[('Yes', 'Yes'), ('No', 'No')], blank=True, null=True)
    exercise_frequency = models.IntegerField(blank=True, null=True)
    symptoms = models.TextField(blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='users/profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.username

    @property
    def is_admin(self):
        return self.is_superuser

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('pbkdf2_sha256$'):
            self.set_password(self.password)
        super(User, self).save(*args, **kwargs)