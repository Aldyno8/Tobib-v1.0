from django.contrib import admin
from .models import ContactPro

class ContactProAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'speciality', 'created_at')

admin.site.register(ContactPro, ContactProAdmin)