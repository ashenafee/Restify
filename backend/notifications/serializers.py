
from rest_framework import serializers

from comments.serializers import GuestCommentSerializer
from .models import Notification, RatingNotification, ReservationNotification, CancellationNotification, GuestCommentNotification
from properties.serializers import ReservationListSerializer
from accounts.serializers import UserSerializer


class RatingNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingNotification
        fields = ['id', 'user', 'text', 'date', 'rating']


class ReservationNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservationNotification
        fields = ['id', 'user', 'text', 'date', 'reservation']

    def to_representation(self, instance):
        self.fields['reservation'] = ReservationListSerializer(read_only=True)
        return super().to_representation(instance)


class CancellationNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CancellationNotification
        fields = ['id', 'user', 'text', 'date', 'reservation' , 'guest']

    def to_representation(self, instance):
        self.fields['reservation'] = ReservationListSerializer(read_only=True)
        self.fields['guest'] = UserSerializer(read_only=True)
        return super().to_representation(instance)


class GuestCommentNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestCommentNotification
        fields = ['id', 'user', 'text', 'date', 'comment']

    def to_representation(self, instance):
        self.fields['comment'] = GuestCommentSerializer(read_only=True)
        return super().to_representation(instance)


class NotificationSerializer(serializers.ModelSerializer):
    
    reservation_notifications = ReservationNotificationSerializer(many=True, read_only=True)
    cancellation_notifications = CancellationNotificationSerializer(many=True, read_only=True)
    rating_notifications = RatingNotificationSerializer(many=True, read_only=True)
    guest_comment_notifications = GuestCommentNotificationSerializer(many=True, read_only=True)

    class Meta:
        model = Notification
        fields = '__all__'

    # Display the correct serializer based on the type of notification
    def to_representation(self, instance):
        if instance.type == 'reservation':
            # Cast the instance to a ReservationNotification instance
            instance = ReservationNotification.objects.get(id=instance.id)
            return ReservationNotificationSerializer(instance).data
        
        elif instance.type == 'rating':
            # Cast the instance to a RatingNotification instance
            instance = RatingNotification.objects.get(id=instance.id)
            return RatingNotificationSerializer(instance).data
        
        elif instance.type == 'cancellation':
            # Cast the instance to a CancellationNotification instance
            instance = CancellationNotification.objects.get(id=instance.id)
            return CancellationNotificationSerializer(instance).data

        elif instance.type == 'guest-comment':
            # Cast the instance to a GuestCommentNotification instance
            instance = GuestCommentNotification.objects.get(id=instance.id)
            return GuestCommentNotificationSerializer(instance).data
        
        return super().to_representation(instance)

