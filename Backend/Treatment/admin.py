from django.contrib import admin
from .models import Treatment

# Register your models here.
class TreatmentAdmin(admin.ModelAdmin):
	list_display = ('medocs_name', 'user', 'started_at', 'end', 'jours_restants')
	search_fields = ('medocs_name', 'user__username')
	list_filter = ('user__username',)

admin.site.register(Treatment, TreatmentAdmin)
