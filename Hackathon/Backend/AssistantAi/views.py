import os, json
import google.generativeai as AI
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from users.models import User
from .shema_json import *
from .models import ExerciceModel

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
AI.configure(api_key=GOOGLE_API_KEY)

def configModels(response_shema):
    generation_config = {
                "temperature": 1,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 5000,
                "response_mime_type": "application/json",
                "response_schema": response_shema,
            }
    return generation_config

identity = f"""Tu es RADOKO, un modèle d'IA francais spécialisé dans l'assistance en santé et bien-être. 
            Ton rôle est de fournir des conseils clairs, précis et adaptés aux besoins individuels 
            pour aider les utilisateurs à améliorer leur santé. En tenant compte des symptômes,
            des habitudes de vie et de l'historique médical de l'utilisateur, 
            donne des recommandations pratiques et pertinentes en matière de nutrition, 
            d'exercice physique et de gestion du bien-être. tu ne parlera donc de rien d'autres qui n'a de liaisons
            direct ou indirect avec la sante, dans le cas ou l'user t'incites a le faire, tu lui dira que tu 
            ne peut pas car t'es un assistant virtuelle"""
        
class PostSymptoms(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        symptoms = request.data.get("symptoms")
        generation_config = configModels(Recommendation)
        model = AI.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        user = request.user
        user_data = {
            'age': getattr(user, 'age', None),
            'sex': getattr(user, 'sexe', None),
            'weight': getattr(user, 'weight', None),
            'smoker': getattr(user, 'smoker', None),
            'exercise_frequency': getattr(user, 'exercise_frequency', None),
            'symptoms': symptoms,
            'medical_history': getattr(user, 'medical_history', [])
        }
        prompt = f"donne les suggestions  en francais a cette user vis a vis de ces informations et dis lui les maladies qu'il est suceptible d'avoir"
        content = model.generate_content(f"{prompt} {str(user_data)}")
        try:
            response_data = json.loads(content.text)
        except json.JSONDecodeError:
            return Response({"message": "Erreur dans le format de la réponse du modèle"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(response_data, status=status.HTTP_200_OK)

class ChatBot(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user_input = request.data.get("message")
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
            }

        model = AI.GenerativeModel(model_name="gemini-1.5-flash", 
                                   generation_config=generation_config, 
                                   system_instruction=identity)
    
        chat_session = model.start_chat(history=[
                                        {
                                            "role": "user",
                                            "parts": [
                                                "salut\n",
                                            ],
                                        },
                                        {
                                            "role": "model",
                                            "parts": [
                                                "Salut !\n",
                                            ],
                                        },
                                        ]
        )
        response = chat_session.send_message(user_input)
        return Response({"message": response.text}, status=status.HTTP_200_OK)

class CreateExercices(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        user_data = {
        'age': getattr(user, 'age', None),
        'sex': getattr(user, 'sexe', None),
        'weight': getattr(user, 'weight', None),
        'smoker': getattr(user, 'smoker', None),
        'exercise_frequency': getattr(user, 'exercise_frequency', None),
        'symptoms': getattr(user, 'symptoms', None),
        'medical_history': getattr(user, 'medical_history', [])
        }
        
        prompt = f""" "Crée un programme d'entraînement hebdomadaire pour maintenir et améliorer la santé.

            Nom de l’entraînement : un titre court et descriptif de la séance
            Durée de l’exercice : en minutes
            Intensité : faible, modérée ou élevée, en fonction de l'objectif du jour
            Description de l'exercice : une explication claire de l’objectif de 
            la séance et des principaux muscles travaillés Le programme doit être varié pour inclure du cardio, du renforcement musculaire, du yoga ou étirements,
            et du repos actif. Oriente les exercices vers un objectif de santé générale et bien-être."
                l
        """ 
        generation_config = configModels(ListExercice)
        model = AI.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        content = model.generate_content(f"{prompt}:{str(user_data)}")
        try:
            response_data = json.loads(content.text)
            ExerciceModel.objects.filter(user=user).delete()

            for key, exercice_data in response_data.items():
                exercice = ExerciceModel(
                user=user,
                name=exercice_data['name'],
                duration=exercice_data["duration"],
                exercices_type=", ".join(exercice_data["exercices_type"]),
                intensity=exercice_data["intensity"],
                )
                exercice.save()
        except json.JSONDecodeError:
            return Response({"message": "Erreur dans le format de la réponse du modèle"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(response_data, status=status.HTTP_200_OK)

class CreateRecipe(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        user_data = {
        'age': getattr(user, 'age', None),
        'sex': getattr(user, 'sexe', None),
        'weight': getattr(user, 'weight', None),
        'smoker': getattr(user, 'smoker', None),
        'exercise_frequency': getattr(user, 'exercise_frequency', None),
        'symptoms': getattr(user, 'symptoms', None),
        'medical_history': getattr(user, 'medical_history', [])
        }
        
        generation_config = configModels(RecipeForWeek)
        prompt = f"Programme de nutrition pour une semaine pour cette personne pour garder la santee"
        model = AI.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        content = model.generate_content(f"{prompt}:{str(user_data)}")
        try:
            response_data = json.loads(content.text)
        except json.JSONDecodeError:
            return Response({"message": "Erreur dans le format de la réponse du modèle"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(response_data, status=status.HTTP_200_OK)
