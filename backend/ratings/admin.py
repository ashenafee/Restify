from django.contrib import admin

from .models import Rating, HostRating, GuestRating

# Register your models here.
admin.site.register(Rating)
admin.site.register(HostRating)
admin.site.register(GuestRating)
