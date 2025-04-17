from rest_framework import permissions
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from Treatment.models import Treatment
from ContactPro.models import Slot, Appointement

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

def setup_permissions():
    patient_group, _ = Group.objects.get_or_create(name='Patients')
    doctor_group, _ = Group.objects.get_or_create(name='Doctors')
    
    treatment_content_type = ContentType.objects.get_for_model(Treatment)
    slot_content_type = ContentType.objects.get_for_model(Slot)
    appointment_content_type = ContentType.objects.get_for_model(Appointement)

    patient_permissions = [
        'view_treatment',
        'create_treatment',
        'change_treatment',
        'delete_treatment',
        'view_doctor_list',
        'reserve_slot',
        'view_available_slots',
        'view_patient_appointement',
    ]
    
    doctor_permissions = [
        'create_slot',
        'delete_slot',
        'change_slot',
        'view_doctor_appointement',
    ]
    
    for codename in patient_permissions:
        permission = Permission.objects.get(
            codename=codename,
            content_type= treatment_content_type
        )
        patient_group.permissions.add(permission)
    
    for codename in doctor_permissions:
        permission = Permission.objects.get(
            codename=codename,
            content_type=treatment_content_type
        )
        doctor_group.permissions.add(permission)