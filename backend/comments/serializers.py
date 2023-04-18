from rest_framework import serializers
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .models import HostComment, GuestComment, Comment, Reply, GuestReply, HostReply
from properties.models import Reservation, Property
from accounts.models import User
from accounts.serializers import UserSerializer
from django.core.validators import MinValueValidator, MaxValueValidator


class CommentSerializer(serializers.ModelSerializer):

    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    rating = serializers.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    text = serializers.CharField()

    class Meta:
        abstract = True

    def create(self, validated_data):
        raise NotImplementedError

# comment for a guest left by host
class HostCommentSerializer(serializers.ModelSerializer):

    guest = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    reservation = serializers.PrimaryKeyRelatedField(queryset=Reservation.objects.all())
    type = serializers.CharField(default='comment')

    class Meta:
        model = HostComment
        fields = ['id', 'author', 'guest', 'reservation', 'rating', 'text', 'type']

    def validate_reservation(self, value):
        if value.state != 'Completed':
            raise serializers.ValidationError('Reservation is not complete.')
        if HostComment.objects.filter(reservation=value).exists():
            raise serializers.ValidationError('This reservation has already been commented on.')
        if value.property.host != self.context['request'].user:
            raise serializers.ValidationError('You are not the host of this reservation.')
        return value
    
    def validate_guest(self, value):
        reservation = self.initial_data['reservation']

        # See if the reservation exists
        reservation = get_object_or_404(Reservation, pk=reservation)

        if value != reservation.guest:
            raise serializers.ValidationError('This user is not the guest of this reservation.')
        return value
    
    def create(self, validated_data):
        return HostComment.objects.create(**validated_data)

class GuestCommentSerializer(serializers.ModelSerializer):
    
    host = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())

    class Meta:
        model = GuestComment
        fields = ['id', 'author', 'host', 'property', 'rating', 'text']

    def validate_property(self, value):
        if GuestComment.objects.filter(property=value, author=self.context['request'].user).exists():
            raise serializers.ValidationError('You have already commented on this property.')
        if not Reservation.objects.filter(property=value, 
                                          guest=self.context['request'].user, 
                                          state__in=['Completed', 'Cancelled']).exists():
            raise serializers.ValidationError('You have not stayed at this property.')
        return value
    
    def validate_host(self, value):
        property = self.initial_data['property']

        # See if the property exists
        property = get_object_or_404(Property, pk=property)

        if value != property.host:
            raise serializers.ValidationError('This user is not the host of this property.')
        return value
    
    def create(self, validated_data):
        return GuestComment.objects.create(**validated_data)
    

class ReplySerializer(serializers.ModelSerializer):

    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    text = serializers.CharField()

    class Meta:
        abstract = True

    def create(self, validated_data):
        raise NotImplementedError


class HostReplySerializer(serializers.ModelSerializer):
    """
    Serialize the host's response to the guest's comment.
    """

    comment = serializers.PrimaryKeyRelatedField(queryset=GuestComment.objects.all())

    class Meta:
        model = HostReply
        fields = ['id', 'author', 'comment', 'text']

    def validate_comment(self, value):
        if value.author == self.context['request'].user:
            raise serializers.ValidationError('You cannot reply to your own comment.')
        
        # Check if the user has already replied to the guest's comment
        if HostReply.objects.filter(comment__author=value.author, author=self.context['request'].user).exists():
            raise serializers.ValidationError('You have already replied to this comment.')

        return value
    
    def create(self, validated_data):
        return HostReply.objects.create(**validated_data)


class GuestReplySerializer(serializers.ModelSerializer):
    """
    Serialize the guest's response to the host's comment.
    """

    comment = serializers.PrimaryKeyRelatedField(queryset=HostComment.objects.all())

    class Meta:
        model = GuestReply
        fields = ['id', 'author', 'comment', 'text']

    def validate_comment(self, value):
        if value.author == self.context['request'].user:
            raise serializers.ValidationError('You cannot reply to your own comment.')
        
        # Check if the user has already replied to the host's comment
        if GuestReply.objects.filter(comment__author=value.author, author=self.context['request'].user).exists():
            raise serializers.ValidationError('You have already replied to this comment.')

        return value
    
    def create(self, validated_data):
        return GuestReply.objects.create(**validated_data)
