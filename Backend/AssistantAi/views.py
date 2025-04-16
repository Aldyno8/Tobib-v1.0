import os, json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class PostSymptoms(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        symptoms = request.data.get("symptoms")
        user = request.user
        user_data = {
            'age': getattr(user, 'age', None),
            'gender': getattr(user, 'sexe', None),
            'smoker': getattr(user, 'smoker', None),
            'symptoms': symptoms,
            'blood_pressure': getattr(user, 'blood_pressure', None),
            'cholesterol_level': getattr(user, 'cholesterol_level', None),
        }
        