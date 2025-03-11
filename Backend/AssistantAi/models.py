from django.db import models
from django.contrib.auth.models import User

class ExerciceModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    duration = models.CharField(max_length=50)
    exercices_type = models.CharField(max_length=50)
    intensity = models.CharField(max_length=50)
    def __str__(self):
        return f"{self.name} ({self.duration}) - {self.intensity}"
