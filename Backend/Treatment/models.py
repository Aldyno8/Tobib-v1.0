from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta
from datetime import datetime

# Create your models here.
class Treatment(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	medocs_name = models.CharField(max_length=200)
	frequency = models.IntegerField()
	created_at = models.DateTimeField(auto_now_add=True)
	started_at = models.DateTimeField(auto_now_add=True)
	duration_days = models.IntegerField()
	end = models.DateTimeField(null=True, blank=True)

	def save(self, *args, **kwargs):
		if self.started_at and self.duration_days:
			self.end = self.started_at + timedelta(days=self.duration_days)
		super().save(*args, **kwargs)

	@property
	def jours_restants(self):
		if self.end:
			jours_restants = (self.end - datetime.now()).days
			return max(0, jours_restants)  
		return None

	def __str__(self):
		return self.medocs_name
