from rest_framework import serializers
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response

from accounts.models import User



from properties.models import Reservation
from .models import GuestComment, PropertyComment, Reply


class ReplySerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Reply
        fields = '__all__'


class GuestCommentSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = GuestComment
        fields = '__all__'


    def validate_reservation(self, reservation):
        if reservation.state != Reservation.COMPLETED:
            raise serializers.ValidationError('You cannot write a comment for an incomplete reservation')
        return reservation

    def validate(self, data):
        view = self.context.get('view')
        guest_id = view.kwargs.get('user_id')

        request = self.context.get('request')

        # Check if a user is a host, meaning check if a user has a property - then they can write a comment for a guest
        if request.user.properties.exists():
            # Get all the reservations that belong to any of the properties owned by the user
            reservations = Reservation.objects.filter(property__in=request.user.properties.all())

            # Filter reservations that have status completed
            reservations_completed = reservations.filter(state=Reservation.COMPLETED)

            # Get the ids of the guests that have completed reservations
            guests_from_reservations = [reservation.guest.id for reservation in reservations_completed]

            # Write a comment for a selected guest
            guest_to_be_commented = get_object_or_404(User, id=guest_id)

            # Check if the guest_id is from the list of guestsFromReservations
            if guest_to_be_commented.id not in guests_from_reservations:
                raise serializers.ValidationError('You cannot write a comment for this guest')
        else:
            raise serializers.ValidationError('You do not have permission to leave a rating for this guest.')

        return data




class PropertyCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyComment
        fields = '__all__'



