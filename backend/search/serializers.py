from rest_framework import serializers
from rest_framework.serializers import ValidationError
from PIL import Image

from accounts.models import User
from properties.models import Amenity, Availability, Property, PropertyImage
from datetime import datetime
from comments.models import HostComment, GuestComment
from django.db.models import Avg



class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name']

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'start_date', 'end_date', 'price_per_night']

    # add validation for start_date and end_date
    def validate_start_date(self, value):
        if value < datetime.now().date():
            raise serializers.ValidationError('The start date must be in the future.')
        return value
    
    def validate_end_date(self, value):
        if value < datetime.now().date():
            raise serializers.ValidationError('The end date must be in the future.')
        
        start_date = self.initial_data.get('start_date')
        if start_date:
            if value < datetime.strptime(start_date, '%Y-%m-%d').date():
                raise serializers.ValidationError('The end date must be later than the start date.')

        return value

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields =['name','image','default']

class PropertyCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.first_name')

    class Meta:
        model = GuestComment
        fields = ['id', 'author_name', 'rating', 'text', ]

class PropertySearchSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True)
    imagesOfProperty = PropertyImageSerializer(many=True)
    commentsOftheProperty = PropertyCommentSerializer(many=True)

    #calculate average rating
    rating = serializers.SerializerMethodField()
    def get_rating(self, obj):
        return obj.commentsOftheProperty.aggregate(Avg('rating'))['rating__avg']

    class Meta:
        model = Property
        fields = ['id', 'imagesOfProperty', 'name', 'location', 'guests', 'beds', 'bathrooms', 'amenities', 'rating', 'commentsOftheProperty']

    def validate(self, data):
        amenities = data.get('amenities')
        if amenities:
            for amenity in amenities:
                if not Amenity.objects.filter(name=amenity['name']).exists():
                    raise serializers.ValidationError('Amenity with name={} does not exist.'.format(amenity['name']))
        return data


# class HostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['first_name', 'last_name', 'email',
#                   'phone_number', 'avatar']


# class PropertyViewSerializer(serializers.ModelSerializer):
#     amenities = AmenitySerializer(many=True)
#     imagesOfProperty = PropertyImageSerializer(many=True)
#     host = HostSerializer()

#     class Meta:
#         model = Property
#         #rating field?
#         fields = ['id', 'host', 'name', 'description', 'location', 'beds', 'guests', 'bathrooms', 'amenities','imagesOfProperty']

#     def get_images(self, obj):
#         return PropertyImageSerializer(obj.imagesOfProperty.all(), many=True).data

    

