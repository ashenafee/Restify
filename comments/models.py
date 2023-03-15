from django.db import models
#import User from accounts app
from accounts.models import User
from properties.models import Amenity, Availability, Property, PropertyImage, Reservation
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator


# As a host, I can leave rating and comment about a user who has had a 
# completed reservation to one of my properties, viewable by other hosts.

# comment system
class Comment(models.Model):
    # author of the comment. One author can have many comments, and one comment can have one author
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    text = models.TextField()

#comment left by a host
class HostComment(Comment):
    # Guest who the comment is about
    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guest_being_commented')
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)

    def __str__(self):
        return f'Host {self.author.first_name} commented on {self.guest.first_name}\'s stay at {self.reservation.property.name}'

#comment left by a guest
class GuestComment(Comment):
    # Host who the comment is about
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='host_being_commented')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='commentsOftheProperty')

    def __str__(self):
        return f'Guest {self.author.first_name} commented on {self.host.first_name}\'s property {self.property.name}'


class Reply(models.Model):
    # author of the reply. One author can have many replies, and one reply can have one author
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    text = models.TextField()

#host reply to a guest comment
class HostReply(Reply):
    # Comment that the reply is about
    comment = models.ForeignKey(GuestComment, on_delete=models.CASCADE)

    def __str__(self):
        return f'Host {self.author.first_name} replied to {self.comment.author.first_name}\'s comment on {self.comment.reservation.property.name}'

#guest reply to a host comment
class GuestReply(Reply):
    # Comment that the reply is about
    comment = models.ForeignKey(HostComment, on_delete=models.CASCADE)

    def __str__(self):
        return f'Guest {self.author.first_name} replied to {self.comment.author.first_name}\'s comment on {self.comment.reservation.property.name}'