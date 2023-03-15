from django.db import models
#import User from accounts app
from accounts.models import User
from properties.models import Amenity, Availability, Property, PropertyImage, Reservation
from django.utils import timezone

# comment system
class Comment(models.Model):
    # author of the comment. One author can have many comments, and one comment can have one author
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    text = models.TextField()

    class Meta:
        abstract = True

class GuestComment(Comment):
    #?
    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name='CommentsOfGuest')
    #  associated reservation
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    rating = models.IntegerField()

class PropertyComment(Comment):
    #?
    #host = models.ForeignKey(User, on_delete=models.CASCADE)
    #  associated property
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='CommentsOfProperty')

    # for example when you read others comments about the property you see dates of the reservation
    # of other guests
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)

    rating = models.IntegerField()

class Reply(Comment):
    parent = models.ForeignKey(PropertyComment, on_delete=models.CASCADE, related_name='replies')
