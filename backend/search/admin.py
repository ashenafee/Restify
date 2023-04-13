from django.contrib import admin
from accounts.models import User
from properties.models import Amenity, PropertyImage, Availability, Property


# Register your models here.
admin.site.register(Amenity)