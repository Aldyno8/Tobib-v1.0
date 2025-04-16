from django.urls import path
from .views import ContactList

urlpatterns = [
    path('contact/', ContactList.as_view(), name='contact-list'),
]
