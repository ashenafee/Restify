from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, ValidationError

from .models import Property, Amenity, PropertyImage, Reservation


class propertyCreateSerializer(ModelSerializer):
    class Meta:
        model = Property
        fields = ['address', 'description', 'guests', 'beds', 'bathrooms',
                  'location','rating', 'amenities']

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

class reservationCreator(ModelSerializer):
    state = serializers.CharField(default=Reservation.PENDING)
    class Meta:
        model = Reservation
        fields = ['guest', 'start_date', 'end_date', 'state', 'property']

class propertyEditorSerializer(ModelSerializer):
    class Meta:
        model = Property
        fields = ['description', 'guests', 'beds', 'bathrooms', 'amenities', 'location']

class ReservationUpdateStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['state']

class PropertyDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'

class CompletedReservationSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source='property.name')
    property_address = serializers.CharField(source='property.address')

    class Meta:
        model = Reservation
        fields = ['id', 'start_date', 'end_date', 'property_name', 'property_address']