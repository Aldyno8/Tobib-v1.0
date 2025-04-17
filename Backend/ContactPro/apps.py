from django.apps import AppConfig


class ContactConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ContactPro'

    def ready(self):
        from Auth.permissions import setup_permissions
        setup_permissions()