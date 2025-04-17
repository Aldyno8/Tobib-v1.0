from django.contrib import admin
from .models import Slot, Appointement


class SlotAdmin(admin.ModelAdmin):
    list_display = ('start_time', 'end_time', 'is_available', 'slot_created_at', 'doctor')

class AppointementAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'slot', 'created_at')

admin.site.register(Slot, SlotAdmin)
admin.site.register(Appointement, AppointementAdmin)