from django.http import Http404
from rest_framework import serializers
from .models import Rating

from properties.models import Reservation, Property
from accounts.models import User


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'host', 'guest', 'property', 'rating', 'comment']


class CreateRatingSerializer(serializers.ModelSerializer):

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
        fields = ['host', 'guest', 'property', 'rating', 'comment']

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

