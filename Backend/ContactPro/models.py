from django.db import models

class ContactPro(models.Model):
	name = models.CharField(max_length=255)
	number = models.CharField(max_length=10)
	email = models.EmailField()
	speciality = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True)
	workplace = models.CharField(max_length=255)

	def __str__(self):
		return self.name
