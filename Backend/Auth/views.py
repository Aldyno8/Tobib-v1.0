from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from Auth import serialisers
from Auth.models import User

class UserRegister(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email") 
        age = request.data.get("age")
        gender = request.data.get("gender")
        blood_pressure = request.data.get("blood_pressure")
        cholesterol_level = request.data.get("cholesterol_level")
        password = request.data.get("password")
        try:
            user = User(username=username, email=email, age=age, gender=gender, blood_pressure=blood_pressure, cholesterol_level=cholesterol_level)
            user.set_password(password)
            user.save()
            return Response({"message": "Compte crée avec succes"}, status=status.HTTP_201_CREATED)
        except Exception as error:
            return Response({"message": str(error)}, status=status.HTTP_400_BAD_REQUEST)
        
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = serialisers.UserSerialiser
    
class UpdateUserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = serialisers.UserSerialiser

class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = serialisers.UserSerialiser
    
class UserProfilView(APIView):
    def get(self, request):
        user = request.user
        try:
            serialiser = serialisers.UserSerialiser(user)
            return Response(serialiser.data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"message":str(error)}, status=status.HTTP_400_BAD_REQUEST)
