from rest_framework import serializers
from django.contrib.auth.models import Group
from Auth.models import User

class GroupsSerialisers(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name']
class UserSerialiser(serializers.ModelSerializer):
    user_groups = GroupsSerialisers(many=True, source='groups')
    class Meta:
        model = User
        fields = ['username', 'email', 'user_groups', 'age', 'gender', 'blood_pressure', 'cholesterol_level']
