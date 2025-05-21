from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from Auth import serialisers
from Auth.models import UserAbstract
from Auth.permissions import IsDoctor, IsPatient

class PatientRegister(APIView):
    permission_classes = [AllowAny]   
    def post(self, request):
        try:
            serializer = serialisers.PatientRegisterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Compte patient créé avec succès"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return Response({"message": str(error)}, status=status.HTTP_400_BAD_REQUEST)

class DoctorRegister(APIView):
    permission_classes = [AllowAny]    
    def post(self, request):
        try:
            serializer = serialisers.DoctorRegisterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Compte docteur créé avec succès"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return Response({"message": str(error)}, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = UserAbstract.objects.all()
    serializer_class = serialisers.UserSerialiser

class UpdateUserView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = UserAbstract.objects.all()
    serializer_class = serialisers.UserSerialiser

class UserDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = UserAbstract.objects.all()
    serializer_class = serialisers.UserSerialiser

class UserProfilView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        try:
            serializer = serialisers.UserSerialiser(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"message": str(error)}, status=status.HTTP_400_BAD_REQUEST)

class DoctorDashboardView(APIView): 
    def get(self, request):
        if not request.user.is_doctor:
            return Response({"message": "Vous n'avez pas les permissions pour accéder à ce tableau de bord"}, status=status.HTTP_403_FORBIDDEN)
        return Response({"message": "Bienvenue sur le tableau de bord des docteurs"})

class PatientDashboardView(APIView):
    def get(self, request):
        if request.user.is_doctor:
            return Response({"message": "Vous n'avez pas les permissions pour accéder à ce tableau de bord"}, status=status.HTTP_403_FORBIDDEN)
        return Response({"message": "Bienvenue sur le tableau de bord des patients"})
