from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.filters import OrderingFilter

from properties.models import Property
from .serializers import PropertySearchSerializer
from rest_framework.serializers import ValidationError

from django.db.models import Avg

class PropertySearchView(ListAPIView):
    serializer_class = PropertySearchSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['availabilitiesOfProperty__price_per_night', 'beds', 'guests']

    def get_queryset(self):
        queryset = Property.objects.all()
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        location = self.request.query_params.get('location', None)
        guests = self.request.query_params.get('guests', None)
        amenities = self.request.query_params.getlist('amenities', [])

        if location:
            queryset = queryset.filter(location__icontains=location)
        if guests:
            queryset = queryset.filter(guests=guests)
        if amenities:
            queryset = queryset.filter(amenities__name__in=amenities).distinct()

        if start_date and end_date:
            if start_date > end_date:
                raise ValidationError('Start date must be before end date.')

        if start_date and end_date:
            queryset = queryset.filter(availabilitiesOfProperty__start_date__lte=end_date, availabilitiesOfProperty__end_date__gte=start_date)

        sort_by = self.request.query_params.get('sort', None)
        order_by = self.request.query_params.get('order', None)
        if sort_by == 'rating':
            queryset = queryset.annotate(avg_rating=Avg('commentsOftheProperty__rating'))
            if order_by == 'asc':
                queryset = queryset.order_by('avg_rating')
            elif order_by == 'desc':
                queryset = queryset.order_by('-avg_rating')
        if sort_by == 'price':
            if order_by == 'asc':
                queryset = queryset.order_by('availabilitiesOfProperty__price_per_night')
            elif order_by == 'desc':
                queryset = queryset.order_by('-availabilitiesOfProperty__price_per_night')

        return queryset


# class PropertyView(RetrieveAPIView):
#     serializer_class = PropertyViewSerializer

#     def get_queryset(self):
#         return Property.objects.prefetch_related('imagesOfProperty')

#     def get_object(self):
#         id = self.kwargs['property_id']
#         return Property.objects.get(id=id)

