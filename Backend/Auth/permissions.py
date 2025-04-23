from rest_framework import permissions
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from Treatment.models import Treatment
from ContactPro.models import Slot, Appointement

def ensure_groups_exist():
    """
    Vérifie et crée les groupes s'ils n'existent pas
    """
    Group.objects.get_or_create(name='Patients')
    Group.objects.get_or_create(name='Doctors')

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
    ensure_groups_exist()
    patient_group = Group.objects.get(name='Patients')
    doctor_group = Group.objects.get(name='Doctors')
    
    treatment_content_type = ContentType.objects.get_for_model(Treatment)
    slot_content_type = ContentType.objects.get_for_model(Slot)
    appointment_content_type = ContentType.objects.get_for_model(Appointement)

    patient_permissions = [
        'add_appointement',
        'change_appointement',
        'delete_appointement',
        'view_appointement',
        'add_treatment',
        'change_treatment',
        'delete_treatment',
        'view_treatment',
        'view_slot'
    ]
    
    doctor_permissions = [
        'add_slot',
        'change_slot',
        'delete_slot',
        'delete_appointement',
        'change_appointement',
        'view_appointement',
        'view_slot',
    ]

    for codename in patient_permissions:
        if (codename.split("_")[1] == "treatment"):
            permission = Permission.objects.get(
                codename=codename,
                content_type= treatment_content_type
            )
            patient_group.permissions.add(permission)
        elif (codename.split("_")[1] == "slot"):
            permission = Permission.objects.get(
                codename=codename,
                content_type= slot_content_type
            )
            patient_group.permissions.add(permission)
        elif (codename.split("_")[1] == "appointement"):
            permission = Permission.objects.get(
                codename=codename,
                content_type= appointment_content_type
            )
            patient_group.permissions.add(permission)

    
    for codename in doctor_permissions:
        if (codename.split("_")[1] == "treatment"):
            permission = Permission.objects.get(
                codename=codename,
                content_type= treatment_content_type
            )
            doctor_group.permissions.add(permission)
        elif (codename.split("_")[1] == "slot"):
            permission = Permission.objects.get(
                codename=codename,
                content_type= slot_content_type
            )
            doctor_group.permissions.add(permission)
        elif (codename.split("_")[1] == "appointement"):
            permission = Permission.objects.get(
                codename=codename,
                content_type= appointment_content_type
            )
            doctor_group.permissions.add(permission)