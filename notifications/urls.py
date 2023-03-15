from django.urls import path

from .views import ListNotificationsAPIView

app_name = 'notifications'

urlpatterns = [
    path('list/', ListNotificationsAPIView.as_view(), name='list_notifications'),
]