from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model
User = get_user_model()

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsAdminOrReadOnly(BasePermission):


    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:

            return True
        return request.user and request.user.is_admin

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):

        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        if isinstance(obj, User):
            return obj == request.user or request.user.is_admin


        return obj.user == request.user or request.user.is_admin











