from rest_framework import permissions

class IsDoctor(permissions.BasePermission):
    """
    Permission personnalisée pour vérifier si l'utilisateur est un docteur
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_doctor

class IsPatient(permissions.BasePermission):
    """
    Permission personnalisée pour vérifier si l'utilisateur est un patient
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and not request.user.is_doctor 