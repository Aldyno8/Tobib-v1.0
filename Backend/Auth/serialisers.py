from rest_framework import serializers
from django.contrib.auth.models import Group
from Auth.models import UserAbstract

class GroupsSerialisers(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name']

class UserSerialiser(serializers.ModelSerializer):
    user_groups = GroupsSerialisers(many=True, source='groups')
    class Meta:
        model = UserAbstract
        fields = ['username', 'email', 'user_groups', 'age', 'gender', 'blood_pressure', 'cholesterol_level', 'is_doctor']

class PatientRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = UserAbstract
        fields = ['username', 'email', 'password', 'age', 'gender', 'blood_pressure', 'cholesterol_level']
    
    def create(self, validated_data):
        user = UserAbstract.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            age=validated_data.get('age'),
            gender=validated_data.get('gender'),
            blood_pressure=validated_data.get('blood_pressure'),
            cholesterol_level=validated_data.get('cholesterol_level'),
            is_doctor=False
        )
        patient_group = Group.objects.get(name='Patients')
        user.groups.add(patient_group)
        
        return user

class DoctorRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = UserAbstract
        fields = ['username', 'email', 'password', 'specialization']
    
    def create(self, validated_data):
        user = UserAbstract.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            specialization=validated_data['specialization'],
            is_doctor=True
        )
        
        # Ajouter l'utilisateur au groupe Doctors
        doctor_group = Group.objects.get(name='Doctors')
        user.groups.add(doctor_group)
        
        return user

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAbstract
        fields = ['id','username', 'email', 'specialization', 'workplace']

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAbstract
        fields = ['id','username', 'email', 'age', 'gender', 'blood_pressure', 'cholesterol_level']

 
