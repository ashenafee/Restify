from django.contrib.auth import logout
from rest_framework import status
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
from .models import Property

from .serializers import propertyCreateSerializer, propertyImageCreator, reservationCreator


class propertyCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = propertyCreateSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(host=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

        
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

        # Set the property and guest fields of the serializer data
        data = request.data.copy()
        data['property'] = property.id
        data['guest'] = request.user.id

        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

