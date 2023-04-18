from django.http import Http404
from rest_framework import serializers
from .models import Rating, HostRating, GuestRating

from properties.models import Reservation, Property
from accounts.models import User
from django.utils import timezone
from django.utils.dateformat import format
from datetime import datetime


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'host', 'guest', 'property', 'created_at', 'rating', 'comment']


class CreateRatingSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    guest = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all())
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=500, allow_blank=True,
                                    required=False)

    # Set host to the authenticated user
    host = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Rating
        fields = ['host', 'guest', 'property', 'rating', 'created_at', 'comment']

    def create(self, validated_data):
        validated_data['created_at'] = timezone.now()
        return super(GuestRatingSerializer, self).create(validated_data)

    def validate_guest(self, value):
        self._check_guest_valid()
        return value

    def validate_property(self, value):
        self._check_guest_valid()
        return value

    def _check_guest_valid(self):
        guest_id = self.initial_data['guest']
        property_id = self.initial_data['property']
        # Get all reservations for the property
        reservations = Reservation.objects.filter(property_id=property_id)
        # Check if the guest has a COMPLETED reservation for the property
        reservation = reservations.filter(guest_id=guest_id,
                                          state=Reservation.COMPLETED).first()
        if not reservation:
            raise serializers.ValidationError('The guest has no completed '
                                              'reservation for the property.')

    def validate(self, data):
        # Check if a rating already exists for the guest and property
        guest = data['guest']
        p = data['property']
        rating = Rating.objects.filter(guest=guest, property=p).first()

        if rating:
            raise serializers.ValidationError('You have already left a rating '
                                              'for this guest.')

        # Check if the authenticated user is the owner of the property
        if self.context['request'].user != p.host:
            raise serializers.ValidationError('You do not have permission to '
                                              'leave a rating for this guest.')

        return data

#comment and rating left by a guest for a host(his property)
class HostRatingSerializer(serializers.ModelSerializer):
    # Set guest to the authenticated user
    guest = serializers.HiddenField(default=serializers.CurrentUserDefault())
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')


    class Meta:
        model = HostRating
        fields = ['id', 'host', 'guest', 'property', 'rating', 'created_at', 'comment']

    def create(self, validated_data):
        validated_data['created_at'] = timezone.now()
        return super(GuestRatingSerializer, self).create(validated_data)

    def validate_host(self, value):
        self._check_host_valid()
        return value

    def validate_property(self, value):
        self._check_host_valid()
        return value

    def validate_rating(self, value):
        # Check if the rating is between 1 and 5
        if value < 1 or value > 5:
            raise serializers.ValidationError('The rating must be between 1 '
                                              'and 5.')
        return value

    def validate_comment(self, value):
        # Check if the comment is less than 500 characters
        if len(value) > 500:
            raise serializers.ValidationError('The comment must be less than '
                                              '500 characters.')

        return value

    def _check_host_valid(self):
        host_id = self.initial_data['host']
        property_id = self.initial_data['property']
        # Check if the host is the owner of the property
        property = Property.objects.filter(id=property_id,
                                             host_id=host_id).first()
        if not property:
            raise serializers.ValidationError('The host is not the owner of '
                                              'the property.')


#comment and rating left by a host for a guest
class GuestRatingSerializer(serializers.ModelSerializer):
    # Set host to the authenticated user
    host = serializers.HiddenField(default=serializers.CurrentUserDefault())
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')

    class Meta:
        model = GuestRating
        fields = ['id', 'host', 'guest', 'property', 'rating', 'created_at', 'comment']

    def create(self, validated_data):
        validated_data['created_at'] = timezone.now()
        return super(GuestRatingSerializer, self).create(validated_data)

    def validate_guest(self, value):
        self._check_guest_valid()
        return value

    def validate_property(self, value):
        self._check_guest_valid()
        return value

    def validate_rating(self, value):
        # Check if the rating is between 1 and 5
        if value < 1 or value > 5:
            raise serializers.ValidationError('The rating must be between 1 '
                                              'and 5.')
        return value

    def validate_comment(self, value):
        # Check if the comment is less than 500 characters
        if len(value) > 500:
            raise serializers.ValidationError('The comment must be less than '
                                              '500 characters.')

        return value

    def _check_guest_valid(self):
        guest_id = self.initial_data['guest']
        property_id = self.initial_data['property']
        # Get all reservations for the property
        reservations = Reservation.objects.filter(property_id=property_id)
        # Check if the guest has a COMPLETED reservation for the property
        reservation = reservations.filter(guest_id=guest_id,
                                          state=Reservation.COMPLETED).first()
        if not reservation:
            raise serializers.ValidationError('The guest has no completed '
                                              'reservation for the property.')
