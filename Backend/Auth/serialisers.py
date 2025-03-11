from rest_framework import serializers
from django.contrib.auth.models import Group
from django.contrib.auth.models import User as AbstractUser

class GroupsSerialisers(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name']
class UserSerialiser(serializers.ModelSerializer):
    user_groups = GroupsSerialisers(many=True, source='groups')
    class Meta:
        model = AbstractUser
        fields = ['username', 'email', 'user_groups']
