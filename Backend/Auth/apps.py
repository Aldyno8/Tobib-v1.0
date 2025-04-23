from django.apps import AppConfig


class AuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Auth'

    def ready(self):
        from .permissions import setup_permissions, ensure_groups_exist
        ensure_groups_exist()
        setup_permissions()
