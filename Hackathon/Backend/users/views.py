from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsAdminUser, IsOwnerOrReadOnly
from .models import User
from .serializers import UserSerializer, ProfileSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [TokenAuthentication, BasicAuthentication]

    def get_queryset(self):
        if self.action == 'me':
            return User.objects.filter(id=self.request.user.id)
        return User.objects.all()

    def get_permissions(self):
        if self.action in ['register', 'login']:
            self.permission_classes = [AllowAny]
        elif self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
        elif self.action in ['create']:
            self.permission_classes = [IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    @action(detail=False, methods=['post'], url_path='register', permission_classes=[AllowAny], parser_classes=[MultiPartParser])
    def register(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'user': serializer.data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='login', permission_classes=[AllowAny])
    def login(self, request):
        username_or_email = request.data.get('username_or_email')
        password = request.data.get('password')

        if not username_or_email or not password:
            return Response({'error': 'Username or email and password required'}, status=status.HTTP_400_BAD_REQUEST)

        if '@' in username_or_email:
            try:
                user = User.objects.get(email=username_or_email)
                username = user.username
            except User.DoesNotExist:
                return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            username = username_or_email

        user = authenticate(username=username, password=password)

        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,

            }, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='logout', permission_classes=[IsAuthenticated])
    def logout(self, request):
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = ProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['patch'], url_path='profile/edit', permission_classes=[IsAuthenticated], parser_classes=[MultiPartParser])
    def perform_update(self, request):
        user = request.user
        data = request.data.copy()

        if 'profile_picture' not in request.data or request.data['profile_picture'] == 'null':
            data.pop('profile_picture', None)

        serializer = ProfileSerializer(user, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='all', permission_classes=[IsAuthenticated])
    def get_all_users(self, request):
        users = User.objects.all()
        serializer = ProfileSerializer(users, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='profile', permission_classes=[IsAuthenticated])
    def get_user(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            serializer = ProfileSerializer(user, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)