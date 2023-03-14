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
from datetime import date
from .serializers import propertyCreateSerializer, propertyImageCreator, reservationCreator, propertyEditorSerializer, ReservationUpdateStateSerializer, PropertyDetailSerializer,CompletedReservationSerializer


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


# For users to create a pending reservation
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
        data['state'] = Reservation.PENDING

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
    

# Updating reservation for the property owner

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
        
        # Check for valid state
        state = serializer.validated_data.get('state')
        if state not in [choice[0] for choice in Reservation.RESERVATION_STATES]:
            return Response({"detail": "Invalid state value."}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
class PropertyDetailView(APIView):
    def get(self, request, property_id):
        try:
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PropertyDetailSerializer(property)
        return Response(serializer.data)
    
class ReservationCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        reservation_id = self.kwargs.get('reservation_id')
        try:
            reservation = Reservation.objects.get(id=reservation_id)
            return reservation
        except Reservation.DoesNotExist:
            raise NotFound('Reservation not found')

    def post(self, request, reservation_id):
        reservation = self.get_object()

        # Check that the reservation belongs to the current user
        if request.user != reservation.guest:
            return Response({"detail": "Not the owner of the reservation."}, status=status.HTTP_403_FORBIDDEN)

        # Update the reservation state to CANCELED
        reservation.state = Reservation.CANCELED
        reservation.save()

        return Response({"detail": "Reservation canceled."})
    
class ReservationHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CompletedReservationSerializer
    def get_queryset(self):
        user = self.request.user
        today = date.today()
        completed_reservations = Reservation.objects.filter(guest=user, state=Reservation.COMPLETED, end_date__lt=today).order_by('-end_date')[:4]
        return completed_reservations   
