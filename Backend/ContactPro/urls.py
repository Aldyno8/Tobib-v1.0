from django.urls import path
from .views import *

urlpatterns = [
    path('contact/', DoctortList.as_view(), name='contact-list'),
	path('slot/', GetAvailableSlot.as_view(), name='get-available-slot'),
	path('reserve/', ReserveSlot.as_view(), name='reserve-slot'),
	path('appointement/doctor/', GetDoctorAppointement.as_view(), name='get-doctor-appointement'),
	path('appointement/patient/', GetPatientAppointement.as_view(), name='get-patient-appointement'),
]
