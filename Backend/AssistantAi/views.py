import os, json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import joblib

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
        model = joblib.load("profils.pkl")
        try:
            prediction = model.predict(user_data)
            return Response(prediction, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
