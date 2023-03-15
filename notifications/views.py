from django.http import JsonResponse
from django.shortcuts import render

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Notification, ReservationNotification, RatingNotification
from .serializers import NotificationSerializer, RatingNotificationSerializer, ReservationNotificationSerializer

from rest_framework import status
from rest_framework.pagination import PageNumberPagination



class CustomPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 5


class ListNotificationsAPIView(ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    pagination_class = CustomPagination

    def get_queryset(self):

        notifs = Notification.objects.filter(user=self.request.user)

        # Sort the notifications by date
        notifs = notifs.order_by('-date')

        return notifs
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        
        # Get the queryset
        queryset = self.get_queryset()

        # Serialize the queryset
        serializer = self.get_serializer(queryset)

        # Add pagination to the response
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

      
    def paginate_queryset(self, queryset):
        """
        Paginate the queryset if required, either returning a
        page object, or `None` if pagination is not configured for this view.
        """
        if self.paginator is None:
            return None
        return self.paginator.paginate_queryset(queryset, self.request, view=self)
