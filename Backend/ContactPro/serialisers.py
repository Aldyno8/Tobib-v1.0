from rest_framework import serializers
from .models import Slot, Appointement

class SlotSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = '__all__'

class AppointementSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Appointement
        fields = '__all__'
