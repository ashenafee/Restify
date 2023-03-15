from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from .serializers import GuestCommentSerializer, PropertyCommentSerializer, ReplySerializer
from properties.models import Reservation
from .models import PropertyComment, GuestComment, Reply
from accounts.models import User

from rest_framework import generics, status
from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class CommentforGuestWriteView(generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = GuestCommentSerializer

def post(self, request, user_id):
        serializer = self.serializer_class(data=request.data, context={'request': request, 'user_id': user_id})

        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class PropertyCommentCreateAPIView(generics.CreateAPIView):
#     serializer_class = PropertyCommentSerializer

#     def post(self, request, property_id):
#         reservation_ids = Reservation.objects.filter(property_id=property_id, guest=request.user, state__in=[Reservation.COMPLETED, Reservation.TERMINATED]).values_list('id', flat=True)
#         if not reservation_ids:
#             return Response({'error': 'No completed or terminated reservation found for the guest'}, status=status.HTTP_400_BAD_REQUEST)
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save(author=request.user, property_id=property_id, reservation_id=reservation_ids[0])
#         return Response(serializer.data)


# class GuestCommentListAPIView(generics.ListAPIView):
#     serializer_class = GuestCommentSerializer

#     def get_queryset(self):
#         queryset = GuestComment.objects.filter(reservation__guest=self.request.user)
#         return queryset


# class PropertyCommentListAPIView(generics.ListAPIView):
#     serializer_class = PropertyCommentSerializer

#     def get_queryset(self):
#         queryset = PropertyComment.objects.filter(property_id=self.kwargs['property_id'])
#         return queryset



# class ReplyViewSet(ModelViewSet):
#     queryset = Reply.objects.all()
#     serializer_class = ReplySerializer
