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
from .models import Property, Reservation, PropertyImage, Availability, Amenity
from .permissions import IsOwner
from datetime import date
from .serializers import ReservationDetailSerializer, AmenityCreateSerializer, ReservationCancelSerializer, propertyCreateSerializer, propertyImageCreator, reservationCreator, propertyEditorSerializer, ReservationUpdateStateSerializer, PropertyDetailSerializer,CompletedReservationSerializer, HostDetailSerializer, ReservationListSerializer, propertyImageEditorSerializer, AvailabilitySerializer
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from notifications.models import ReservationNotification, CancellationNotification
from rest_framework.generics import RetrieveAPIView

# ---------- Amenity General --------------

class AmenityCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AmenityCreateSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            serializer.save(host=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)  
    
class AmenityDeleteView(APIView):
    permission_class = [IsAuthenticated]

    def delete(self, request, amenity_id):
        try:
            to_delete_amenity = Amenity.objects.get(id=amenity_id)
        except Amenity.DoesNotExist:
            return Response({"error": "Amenity not found."})
        amenity_name = to_delete_amenity.name
        to_delete_amenity.delete()
        response_data = {'message': 'Amenity deleted successfully.', 'name': amenity_name}
        return Response(response_data, status=status.HTTP_200_OK)
# ---------- PROPERTY GENERAL -------------

# create a property
class propertyCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = propertyCreateSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            # Set the user as a host
            request.user.is_host = True
            request.user.save()

            serializer.save(host=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

#update property info    
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

#delete property
class PropertyDeleteView(APIView):
    permission_class = [IsAuthenticated]

    def delete(self, request, property_id):
        try:
            to_delete_property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({"error": "Property not found."})
        if self.request.user != to_delete_property.host:
            return Response({"error": "Not owner of property"}) 
        property_name = to_delete_property.name
        property_address = to_delete_property.address
        to_delete_property.delete()
        response_data = {'message': 'Property deleted successfully.', 'name': property_name, 'address': property_address}
        return Response(response_data, status=status.HTTP_200_OK)

#view property details
class PropertyDetailView(RetrieveAPIView):
    serializer_class = PropertyDetailSerializer

    def get_queryset(self):
        Property.objects.prefetch_related('imagesOfProperty')
        Property.objects.prefetch_related('availabilitiesOfProperty')
        return Property.objects.prefetch_related('commentsOftheProperty')

    def get_object(self):
        idFromURL = self.kwargs['property_id']
        return Property.objects.get(id=idFromURL)
    

# ---------- PROPERTY AVAILABILITY -------------

# setting availability for a property
class availabilityCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AvailabilitySerializer

    def post(self, request, property_id):
        try:
            propertyWeNeed = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise NotFound('Property not found.')

        # Check if the current user is the owner of the property
        if not request.user == propertyWeNeed.host:
            raise PermissionDenied('You are not the owner of this property.')

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(property=propertyWeNeed)
        return Response(serializer.data)

#updating availability for a property
class availabilityUpdateView(RetrieveAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AvailabilitySerializer

    def get_object(self):
        availabilityWeNeed = self.kwargs['availability_id']
        return Availability.objects.get(id=availabilityWeNeed)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        user = request.user

        if user != instance.property.host:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

#deleting availability for a property
class availabilityDeleteView(APIView):
    permission_class = [IsAuthenticated]

    def delete(self, request, availability_id):
        try:
            to_delete_availability = Availability.objects.get(id=availability_id)
        except Availability.DoesNotExist:
            return Response({"error": "Availability not found."})
        if self.request.user != to_delete_availability.property.host:
            return Response({"error": "Not owner of property"}) 
        to_delete_availability.delete()
        response_data = {'message': 'Availability deleted successfully.'}
        return Response(response_data, status=status.HTTP_200_OK)


# ---------- PROPERTY IMAGES -------------

#create images for a property   
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

#update images for a property    
class PropertyImageUpdateView(generics.RetrieveUpdateAPIView):
    queryset = PropertyImage.objects.all()
    serializer_class = propertyImageEditorSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.kwargs['image_id']
        return PropertyImage.objects.get(id=id)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        user = request.user

        if user != instance.property.host:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

#delete images for a property
class propertyImageDeleteView(APIView):
    permission_class = [IsAuthenticated]

    def delete(self, request, image_id):
        try:
            to_delete_image = PropertyImage.objects.get(id=image_id)
        except PropertyImage.DoesNotExist:
            return Response({"error": "Image not found."})
        if self.request.user != to_delete_image.property.host:
            return Response({"error": "Not owner of property"}) 
        image_name = to_delete_image.name
        to_delete_image.delete()
        response_data = {'message': 'Image deleted successfully.', 'name': image_name}
        return Response(response_data, status=status.HTTP_200_OK)


# ---------- PROPERTY RESERVATIONS -------------

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
        
        try:
            existing_reservation = Reservation.objects.get(property=property,
                                                        start_date__lte=request.data['end_date'],
                                                        end_date__gte=request.data['start_date'])
        except Reservation.DoesNotExist:
            # If no existing reservation conflicts with the new one, continue with creating the reservation
            pass
        else:

            # THE FOLLOWING CODE IS COMMENTED OUT BECAUSE WE WANT TO ALLOW
            # THE PROPERTY OWNER TO SEE ALL RESERVATIONS, EVEN CANCELED ONES

            # Check if the existing reservation is canceled
            # if existing_reservation.state == Reservation.CANCELED:
            #     # If the existing reservation is canceled, delete it and continue with creating the new reservation
            #     # existing_reservation.delete()
            # else:
            #     # If the existing reservation is not canceled, raise an error
            
            return JsonResponse({'message': 'A reservation already exists within this date range.'}, status=400)
        # Set the property and guest fields of the serializer data
        data = request.data.copy()
        data['property'] = property.id
        data['guest'] = request.user.id
        data['state'] = Reservation.PENDING

        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Send a notification to the property owner
        notification = ReservationNotification.objects.create(
            user=property.host,
            text=f'You have a new reservation request from {request.user.username}.',
            reservation=serializer.instance,
            type='reservation'
        )
        notification.save()

        return Response(serializer.data)


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

        # Send a notification to the guest
        notification = ReservationNotification.objects.create(
            user=instance.guest,
            text=f'Your reservation request for {instance.property.name} has been {state}.',
            reservation=instance,
            type='reservation'
        )
        notification.save()

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class ReservationCancelView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationCancelSerializer

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

        # Serialize the data
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Send a notification to the property owner
        res = Reservation.objects.get(id=reservation_id)
        prop = res.property
        notification = CancellationNotification.objects.create(
            user=prop.host,
            text=f'{request.user.username} has requested to cancel their ({res.start_date} - {res.end_date}) reservation for {res.property.name}.',
            guest=request.user,
            reservation=res,
            type='cancellation'
        )
        notification.save()
        reservation.state = "Pending"
        reservation.save()

        return Response({
            "detail": "Cancellation request sent to the property owner."
        })
    
class ReservationHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CompletedReservationSerializer
    def get_queryset(self):
        user = self.request.user
        today = date.today()
        completed_reservations = Reservation.objects.filter(guest=user, state=Reservation.COMPLETED, end_date__lt=today).order_by('-end_date')[:4]
        return completed_reservations   

class ReservationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationListSerializer
    pagination_class = PageNumberPagination
    page_size = 4

    def get_queryset(self):
        user = self.request.user
        today = date.today()
        reservations = Reservation.objects
        role = self.request.query_params.get('role')
        if role == 'host':
            reservations = reservations.filter(property__host   =user)
        elif role == 'guest':
            reservations = reservations.filter(guest=user)
        else:
            reservations = reservations.filter(Q(property__host=user) | Q(guest=user))
        state = self.request.query_params.get('state')
        if state:
            reservations = reservations.filter(state=state)
        Property.objects.prefetch_related('reservationsOfProperty')
        return reservations.order_by('-end_date')


class ReservationDetailView(RetrieveAPIView):
    serializer_class = ReservationDetailSerializer


    def get_object(self):
        idFromURL = self.kwargs['reservation_id']
        return Reservation.objects.get(id=idFromURL)

# class HostDetailsView(APIView):
#     def get(self, request, property_id):
#         try:
#             property = Property.objects.get(id=property_id)
#         except Property.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = HostDetailSerializer(property.host)
#         return Response(serializer.data)


# view property details 

# old    
# class PropertyDetailView(APIView):
#     def get(self, request, property_id):
#         try:
#             property = Property.objects.get(id=property_id)
#         except Property.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = PropertyDetailSerializer(property)
#         return Response(serializer.data)