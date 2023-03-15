from datetime import datetime, timedelta
from django.contrib.auth import logout
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSignupSerializer, UserLoginSerializer, UserUpdateSerializer
from notifications.models import ReservationNotification
from properties.models import Reservation


class LoginView(APIView):
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        # See if the user has any upcoming reservations
        upcoming_reservations = Reservation.objects.filter(
            guest=user,
            state='Approved',
            start_date__lte=datetime.now() + timedelta(days=7)
        ).order_by('start_date')

        if upcoming_reservations:
            # Notify the user of their nearest reservation
            reservation = upcoming_reservations[0]
            msg = f'You have a reservation at {reservation.property.name} starting on {reservation.start_date}'

            # Before creating the notification, check if the user already has one
            # for this reservation
            if not ReservationNotification.objects.filter(user=user, text=msg, reservation=reservation).exists():
                notif = ReservationNotification.objects.create(user=user, text=msg, reservation=reservation)
                notif.save()

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Blacklist the token
            refresh_token = request.data.get('refresh')
            refresh_token_obj = RefreshToken(refresh_token)
            refresh_token_obj.blacklist()

            # Logout the user
            logout(request)

            # Return a success response
            return Response({'message': 'Logout Successful'})
        except (InvalidToken, TokenError):
            # Handle invalid token error
            return Response({'error': 'Invalid Token'},
                            status=status.HTTP_400_BAD_REQUEST)


class SignupView(APIView):

    def post(self, request):

        serializer = UserSignupSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            msg = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(msg)

        return Response(serializer.errors, status=400)


class EditProfileView(APIView):
    serializer_class = UserUpdateSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = self.request.user
        serializer = self.serializer_class(user, data=request.data,
                                           partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
