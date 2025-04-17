from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView 
from .views import *

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("register/patient/", PatientRegister.as_view(), name="register_patient"),
    path("register/doctor/", DoctorRegister.as_view(), name="register_doctor"),
    path("delete/<int:pk>", UserDeleteView.as_view(), name="delete"),
    path("update/<int:pk>", UpdateUserView.as_view(), name="update"),
    path("list/", UserListView.as_view(), name="list"),
    path("profil/", UserProfilView.as_view(), name="profil"),
    path("dashboard/doctor/", DoctorDashboardView.as_view(), name="doctor_dashboard"),
    path("dashboard/patient/", PatientDashboardView.as_view(), name="patient_dashboard"),
]
