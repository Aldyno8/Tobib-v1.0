from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Slot, Appointement
from Auth.models import UserAbstract
from Auth.serialisers import UserSerialiser
from Auth.permissions import IsDoctor, IsPatient
from rest_framework.permissions import IsAuthenticated

class ContactList(APIView):
    permission_classes = [IsAuthenticated, IsPatient]
    def get(self, request):
        try:
            contacts = UserAbstract.objects.filter(is_doctor=True)
            serializer = UserSerialiser(contacts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class Createslot(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]
    def post(self, request):
        start = request.data.get('start')
        end = request.data.get('end')
        doctor = request.user
        if (start > end):
            return Response({"error": "la date de fin doit etre apres la date de debut"},
                             status=status.HTTP_400_BAD_REQUEST)
        
        slot = Slot.objects.create(start_time=start, end_time=end, doctor=doctor)
        return Response({"message": "Slot created successfully"}, status=status.HTTP_201_CREATED)
