from django.contrib.auth import logout
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse, JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import Property, Reservation
from .permissions import IsOwner

from .serializers import propertyCreateSerializer, propertyImageCreator, reservationCreator, propertyEditorSerializer, ReservationUpdateStateSerializer


class propertyCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = propertyCreateSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(host=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

        
class propertyImageCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = propertyImageCreator

    def post(self, request, property_id):
        # Extract the property instance from the database
        try:
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise NotFound('Property not found.')
        
        # Check if the current user is the owner of the property
        if not request.user == property.host:
            raise PermissionDenied('You are not the owner of this property.')
        
        # Set the property field of the serializer data
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(property=property)
        return Response(serializer.data)


class ReservationCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = reservationCreator

    def post(self, request, property_id):
        # Extract the property instance from the database
        try:
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise NotFound('Property not found.')

        # Set the property and guest fields of the serializer data
        data = request.data.copy()
        data['property'] = property.id
        data['guest'] = request.user.id

        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class PropertyUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Property.objects.all()
    serializer_class = propertyEditorSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.kwargs['property_id']
        return Property.objects.get(id=id)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        user = request.user

        if user != instance.host:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class ReservationUpdateStateView(APIView):
    serializer_class = ReservationUpdateStateSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_object(self):
        reservation_id = self.kwargs.get('reservation_id')
        try:
            instance = Reservation.objects.get(id=reservation_id)
            return instance
        except Reservation.DoesNotExist:
            raise NotFound('Reservation does not exist')

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Check that the current user is the owner of the reservation's property
        property_owner = instance.property.host
        if request.user != property_owner:
            return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)

        serializer.save()
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)