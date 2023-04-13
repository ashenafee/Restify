from django.contrib import admin

from .models import Notification, RatingNotification, ReservationNotification, CancellationNotification

# Register your models here.

admin.site.register(Notification)
admin.site.register(RatingNotification)
admin.site.register(ReservationNotification)
admin.site.register(CancellationNotification)