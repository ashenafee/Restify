from django.contrib import admin

from .models import HostComment, GuestComment, Comment, Reply, HostReply, GuestReply

# Register your models here.
admin.site.register(HostComment)
admin.site.register(GuestComment)
admin.site.register(Comment)
admin.site.register(Reply)
admin.site.register(HostReply)
admin.site.register(GuestReply)