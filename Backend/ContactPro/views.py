from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ContactPro
from .serialisers import ContactProSerializer

class ContactList(APIView):
    def get(self, request):
        try:
            contacts = ContactPro.objects.all()
            serializer = ContactProSerializer(contacts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
