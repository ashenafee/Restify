from django.urls import path

from .views import ListNotificationsAPIView, ClearNotificationView

app_name = 'notifications'

urlpatterns = [
    path('list/', ListNotificationsAPIView.as_view(), name='list_notifications'),
    path('clear/', ClearNotificationView.as_view(), name='clear_notification'),
]