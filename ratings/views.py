from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Rating
from .serializers import RatingSerializer, CreateRatingSerializer
from properties.models import Reservation, Property
from accounts.models import User


class RatingCreateAPIView(generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CreateRatingSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RatingListAPIView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RatingSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Rating.objects.filter(guest=user_id)

    def get(self, request, user_id):

        # Check if the authenticated user has at least one property
        user = get_object_or_404(User, id=request.user.id)

        if not user.properties.all():
            raise PermissionDenied('You do not have any properties. You cannot '
                                   'view guest ratings from other hosts.')

        # Check if the user_id is a guest with a reservation for the
        # authenticated user's property
        guest = get_object_or_404(User, id=user_id)
        reservations = Reservation.objects.filter(guest=guest)

        if not reservations:
            raise PermissionDenied('You cannot view ratings for this guest.'
                                   'They do not have a reservation for any of '
                                   'your properties.')

        ratings = self.get_queryset()
        serializer = self.serializer_class(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
