from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, ValidationError

from .models import Property, Amenity, PropertyImage, Reservation, Availability
from comments.models import HostComment, GuestComment
from accounts.models import User

from datetime import datetime

class AmenityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['name']

class AvailabilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Availability
        fields = ['id', 'start_date', 'end_date', 'price_per_night']

    # add validation for start_date and end_date
    def validate_start_date(self, value):
        if value < datetime.now().date():
            raise serializers.ValidationError('The start date must be in the future.')
        return value
    
    def validate_end_date(self, value):
        if value < datetime.now().date():
            raise serializers.ValidationError('The end date must be in the future.')
        
        start_date = self.initial_data.get('start_date')
        if start_date:
            if value < datetime.strptime(start_date, '%Y-%m-%d').date():
                raise serializers.ValidationError('The end date must be later than the start date.')

        return value

class propertyCreateSerializer(ModelSerializer):
    class Meta:
        model = Property
        fields = ['name', 'address', 'description', 'guests', 'beds', 'bathrooms',
                  'location', 'amenities']

    def validate(self, data):
        amenities = data.get('amenities')
        if amenities:
            for amenity in amenities:
                if not Amenity.objects.filter(id=amenity.id).exists():
                    raise serializers.ValidationError('Amenity with id={} does not exist.'.format(amenity.id))
        return data

class propertyImageCreator(ModelSerializer):
    class Meta:
        model = PropertyImage
        fields =['name','image','default']

class propertyImageEditorSerializer(ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['name','image','default']

class reservationCreator(ModelSerializer):
    state = serializers.CharField(default=Reservation.PENDING)
    class Meta:
        model = Reservation
        fields = ['guest', 'start_date', 'end_date', 'state', 'property']
    
    def validate_start_date(self, value):
        if value < datetime.now().date():
            raise serializers.ValidationError('The start date must be in the future.')
        return value
    
    def validate_end_date(self, value):
        if value < datetime.now().date():
            raise serializers.ValidationError('The end date must be in the future.')
        
        start_date = self.initial_data.get('start_date')
        if start_date:
            if value < datetime.strptime(start_date, '%Y-%m-%d').date():
                raise serializers.ValidationError('The end date must be later than the start date.')

        return value

class propertyEditorSerializer(ModelSerializer):
    class Meta:
        model = Property
        fields = ['description', 'guests', 'beds', 'bathrooms', 'amenities', 'location']

class ReservationUpdateStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['state']

class ReservationCancelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'state']
    
    def validate_state(self, value):
        if value != Reservation.CANCELED:
            raise serializers.ValidationError('You can only cancel a pending reservation.')
        return value


class HostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','email','phone_number','avatar']

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name']

class PropertyCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = GuestComment
        fields = ['id', 'author', 'rating', 'text', ]


#property details

#old
# class PropertyDetailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Property
#         fields = '__all__'

class PropertyDetailSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True)
    imagesOfProperty = propertyImageCreator(many=True)
    availabilitiesOfProperty = AvailabilitySerializer(many=True)
    host = HostDetailSerializer()
    commentsOftheProperty = PropertyCommentSerializer(many=True)

    class Meta:
        model = Property
        fields = ['id', 'host', 'name', 'description', 'location', 'beds', 'guests', 'bathrooms', 'amenities','imagesOfProperty', 'availabilitiesOfProperty', 'commentsOftheProperty']

    def get_images(self, obj):
        return propertyImageCreator(obj.imagesOfProperty.all(), many=True).data

    def get_availability(self, obj):
        return AvailabilitySerializer(obj.availabilitiesOfProperty.all(), many=True).data

class CompletedReservationSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source='property.name')
    property_address = serializers.CharField(source='property.address')

    class Meta:
        model = Reservation
        fields = ['id', 'start_date', 'end_date', 'property_name', 'property_address']

class ReservationListSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source='property.name')
    property_address = serializers.CharField(source='property.address')

    class Meta:
        model = Reservation
        fields = ['id', 'start_date', 'end_date', 'property_name', 'property_address']