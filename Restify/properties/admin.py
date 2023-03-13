from django.contrib import admin
from .models import Property, PropertyImage, Reservation, Availability


# Register your models here.
admin.site.register(Property)
admin.site.register(PropertyImage)
admin.site.register(Reservation)
admin.site.register(Availability)
