from rest_framework import generics
from .models import Treatment
from .serialisers import TreatmentSerializer

class TreatmentList(generics.ListAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer
    
class TreatmentDetail(generics.RetrieveAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer

class TreatmentCreate(generics.CreateAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer

class TreatmentUpdate(generics.UpdateAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer

class TreatmentDelete(generics.DestroyAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer