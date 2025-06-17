from django.db import models
from Auth.models import UserAbstract

class Slot(models.Model):
	start_time = models.DateTimeField()
	end_time = models.DateTimeField()
	is_available = models.BooleanField(default=True)
	slot_created_at = models.DateTimeField(auto_now_add=True)
	doctor = models.ForeignKey(UserAbstract, on_delete=models.CASCADE)
	
	def __str__(self):
		return f"{self.start_time} - {self.end_time} {self.doctor.username}"
	
class Appointement(models.Model):
	patient = models.ForeignKey(UserAbstract, on_delete=models.CASCADE, related_name='patient')
	doctor = models.ForeignKey(UserAbstract, on_delete=models.CASCADE, related_name='doctor')
	slot = models.ForeignKey(Slot, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.doctor.name} {self.patient.name}"
	
