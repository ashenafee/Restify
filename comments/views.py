from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from .serializers import HostCommentSerializer, GuestCommentSerializer, HostReplySerializer, ReplySerializer, GuestReplySerializer
from properties.models import Property, Reservation
from accounts.models import User

from rest_framework import generics, status
from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Comment, HostComment, GuestComment
from notifications.models import GuestCommentNotification


# As a host, I can leave rating and comment about a user who has had a 
# completed reservation to one of my properties, viewable by other hosts.


class CreateCommentForGuestView(generics.CreateAPIView):
    serializer_class = HostCommentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, user_id, reservation_id):
        # Copy the request data
        data = request.data.copy()

        # Add the reservation and guest to the data
        data['reservation'] = reservation_id
        data['guest'] = user_id

        # Add the author to the data
        data['author'] = request.user.id

        # Add the type of the comment
        data['type'] = 'host-comment'

        # Serialize the data
        serializer = HostCommentSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            # Save the comment
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewCommentsAboutGuestView(generics.ListAPIView):
    serializer_class = HostCommentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        # Get the user
        user = get_object_or_404(User, pk=self.kwargs['user_id'])

        # Get the comments about the user
        comments = HostComment.objects.filter(guest=user)

        return comments

    def list(self, request, user_id):
        # Check if the current user is a host of ANY property
        if not self.request.user.is_host:
            return JsonResponse({'error': 'You are not a host.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the queryset
        queryset = self.get_queryset()

        # Serialize the queryset
        serializer = HostCommentSerializer(queryset, many=True, context={'request': request})

        # Add pagination to the response
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)


# As a user, and for each completed or terminated reservation, I can leave a 
# rating and at most one public comment to the respective property.

class CreateCommentForPropertyView(generics.CreateAPIView):
    serializer_class = GuestCommentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, property_id):
        # Copy the request data
        data = request.data.copy()

        # Add the reservation and property to the data
        data['property'] = property_id
        data['host'] = Property.objects.get(pk=property_id).host.id

        # Add the author to the data
        data['author'] = request.user.id

        # Serialize the data
        serializer = GuestCommentSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            # Save the comment
            serializer.save()

            # Send a notification to the host
            notification = GuestCommentNotification.objects.create(
                user=User.objects.get(pk=data['host']),
                text=f'{request.user.get_full_name()} commented on your property.',
                comment=serializer.instance,
                type='guest-comment'
            )
            notification.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewCommentsAboutPropertyView(generics.ListAPIView):
    serializer_class = GuestCommentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        # Get the property
        property = get_object_or_404(Property, pk=self.kwargs['property_id'])

        # Get the comments about the property
        comments = GuestComment.objects.filter(property=property)

        return comments

    def list(self, request, property_id):
        # Get the queryset
        queryset = self.get_queryset()

        # Serialize the queryset
        serializer = GuestCommentSerializer(queryset, many=True, context={'request': request})

        # Add pagination to the response
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)


# As a host, I can respond to the public comments about my rental properties.

class CreateReplyToCommentView(generics.CreateAPIView):
    serializer_class = ReplySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, comment_id):
        # Copy the request data
        data = request.data.copy()

        # Add the comment to the data
        data['comment'] = comment_id

        # Add the author to the data
        data['author'] = request.user.id

        # Check what type of comment the reply is for
        try:
            comment = HostComment.objects.get(pk=comment_id)
        except HostComment.DoesNotExist:
            try:
                comment = GuestComment.objects.get(pk=comment_id)
            except GuestComment.DoesNotExist:
                return JsonResponse({'error': 'Comment does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        if isinstance(comment, GuestComment):
            # Serialize the data
            serializer = HostReplySerializer(data=data, context={'request': request})
            # serializer = GuestReplySerializer(data=data, context={'request': request})
        elif isinstance(comment, HostComment):
            # Serialize the data
            serializer = GuestReplySerializer(data=data, context={'request': request})

        if serializer.is_valid():
            # Save the reply
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

