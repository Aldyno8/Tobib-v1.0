from django.contrib import admin
from Auth.models import UserAbstract
from django.contrib.auth.models import User

# Register your models here.
class UserAdmin(admin.ModelAdmin):
	list_display = ('username', 'email', 'age', 'gender', 'blood_pressure', 'cholesterol_level')
	search_fields = ('username', 'email')
	list_filter = ('gender',)

# admin.site.unregister(User)
admin.site.register(UserAbstract, UserAdmin)
