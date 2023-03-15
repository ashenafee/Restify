from django.contrib import admin

from .models import GuestComment, PropertyComment, Reply

# Register your models here.
admin.site.register(GuestComment)
admin.site.register(PropertyComment)
admin.site.register(Reply)