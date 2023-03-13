from rest_framework import generics
from .models import Rating
from .serializers import RatingSerializer


class RatingListAPIView(generics.ListAPIView):
    serializer_class = RatingSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Rating.objects.filter(guest=user_id)
