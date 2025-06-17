import os, json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import joblib
import pandas as pd

class PostSymptoms(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            user = request.user
            symptoms = request.data.get("symptoms", {})
            
            user_data = {
                'Age': user.age,
                'Gender': 1 if user.gender == 'Female' else 0,
                'Fever': 1 if symptoms.get('fever', False) else 0,
                'Cough': 1 if symptoms.get('cough', False) else 0,
                'Fatigue': 1 if symptoms.get('fatigue', False) else 0,
                'Difficulty Breathing': 1 if symptoms.get('difficulty_breathing', False) else 0,
                'Blood Pressure': self._map_blood_pressure(getattr(user, 'blood_pressure', user.blood_pressure)),
                'Cholestero Level': self._map_cholesterol(getattr(user, 'cholesterol_level', user.cholesterol_level))
            }
            
            df = pd.DataFrame([user_data])
            
            model = joblib.load("Backend/ML/models/profils.pkl")
            reverse_mapping = joblib.load("Backend/ML/models/reverse_mapping.pkl")
            
            prediction = model.predict(df)
            
            predicted_disease = reverse_mapping[prediction[0]]
            
            return Response({
                "prediction": predicted_disease,
                "confidence": float(model.predict_proba(df).max())
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def _map_blood_pressure(self, value):
        mapping = {"low": 0, "Normal": 1, "High": 2}
        return mapping.get(value, 1)
    
    def _map_cholesterol(self, value):
        mapping = {"low": 0, "Normal": 1, "High": 2}
        return mapping.get(value, 1)

class ChatBot(APIView):
    def post(self, request):
        from google import genai
        api_key = os.getenv("GOOGLE_API_KEY")
        client = genai.Client(api_key=api_key)
        chat = client.chats.create(model="gemini-2.0-flash")
        """ création du serveur websocket"""

        response = chat.send_message("message reçu via le serveur websocket")
        """print renvoi le (response.text) au client """


        for message in chat.get_history():
            print(f'role - {message.role}',end=": ")
            print(message.parts[0].text) 
