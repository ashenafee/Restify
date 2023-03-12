from django.contrib import admin
from .models import User,Property, PropertyImage


# Register your models here.

admin.site.register(Property)
admin.site.register(PropertyImage)