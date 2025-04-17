from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Slot, Appointement
from Auth.models import UserAbstract
from Auth.serialisers import UserSerialiser, DoctorSerializer, PatientSerializer
from Auth.permissions import IsDoctor, IsPatient
from rest_framework.permissions import IsAuthenticated
from .serialisers import SlotSerialiser, AppointementSerialiser

class DoctortList(APIView):
    permission_classes = [IsAuthenticated, IsPatient]
    def get(self, request):
        try:
            contacts = UserAbstract.objects.filter(is_doctor=True)
            serializer = DoctorSerializer(contacts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CreateSlot(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]
    def post(self, request):
        start = request.data.get('start')
        end = request.data.get('end')
        doctor = request.user
        if (start > end):
            return Response({"error": "la date de fin doit etre apres la date de debut"},
                             status=status.HTTP_400_BAD_REQUEST)
        try:
            slot = Slot.objects.create(start_time=start, end_time=end, doctor=doctor)
            return Response({"message": "Slot crée avec succès"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class GetAvailableSlot(APIView):
    permission_classes = [IsAuthenticated, IsPatient]
    def get(self, request):
        try:
            slots = Slot.objects.filter(is_available=True)
            serializer = SlotSerialiser(slots, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ReserveSlot(APIView):
    permission_classes = [IsAuthenticated, IsPatient]
    def post(self, request):
        patient = request.user
        slot_id = request.data.get('slot_id')
        doctor_id = request.data.get('doctor_id')
        try:
            slot = Slot.objects.get(id=slot_id)
            doctor = UserAbstract.objects.get(id=doctor_id)
            if slot.is_available:
                slot.is_available = False
                slot.save()
                Appointement.objects.create(patient=patient, slot=slot, doctor=doctor)
                return Response({"message": "Slot réservé avec succès"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Slot déjà réservé"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class GetDoctorAppointement(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]
    def get(self, request):
        doctor = request.user
        try:
            appointments = Appointement.objects.filter(doctor=doctor)
            serializer = AppointementSerialiser(appointments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class GetPatientAppointement(APIView):
    permission_classes = [IsAuthenticated, IsPatient]
    def get(self, request):
        patient = request.user
        try:
            appointments = Appointement.objects.filter(patient=patient)
            serializer = AppointementSerialiser(appointments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        