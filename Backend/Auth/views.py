from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User as AbstractUser
from rest_framework import status
from rest_framework.views import APIView
from Auth import serialisers

class UserRegister(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email") 
        password = request.data.get("password") 
        try:
            user = AbstractUser(username=username, email=email)
            user.set_password(password)
            user.save()
            return Response({"message": "Compte crée avec succes"}, status=status.HTTP_201_CREATED)
        except Exception as error:
            return Response({"message": str(error)}, status=status.HTTP_400_BAD_REQUEST)
        
class UserListView(generics.ListAPIView):
    queryset = AbstractUser.objects.all()
    serializer_class = serialisers.UserSerialiser
    
class UpdateUserView(generics.UpdateAPIView):
    queryset = AbstractUser.objects.all()
    serializer_class = serialisers.UserSerialiser

class UserDeleteView(generics.DestroyAPIView):
    queryset = AbstractUser.objects.all()
    serializer_class = serialisers.UserSerialiser
    
class UserProfilView(APIView):
    def get(self, request):
        user = request.user
        try:
            serialiser = serialisers.UserSerialiser(user)
            return Response(serialiser.data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"message":str(error)}, status=status.HTTP_400_BAD_REQUEST)
