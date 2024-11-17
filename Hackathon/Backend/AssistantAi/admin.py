from django.contrib import admin
from .models import ExerciceModel

class ExerciceAdmin(admin.ModelAdmin):
    model = ExerciceModel
    list_display = ('name',)

admin.site.register(ExerciceModel, ExerciceAdmin)