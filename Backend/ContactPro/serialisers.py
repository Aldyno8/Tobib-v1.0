from rest_framework import serializers
from .models import ContactPro

class ContactProSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactPro
        fields = '__all__'