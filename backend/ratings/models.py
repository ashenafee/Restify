from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from accounts.models import User
from properties.models import Property

from django.utils import timezone

# As a host, I can leave rating and comment about a user who has had a completed
# reservation to one of my properties, viewable by other hosts.


class Rating(models.Model):

    host = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='ratings_given',
                             help_text='Host who\'s leaving the rating about '
                                       'the guest')

    guest = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name='ratings_received',
                              help_text='Guest who\'s being rated')

    property = models.ForeignKey(Property, on_delete=models.CASCADE,
                                 related_name='ratings',
                                 help_text='Property the guest stayed at')

    rating = models.PositiveIntegerField(validators=[MinValueValidator(1),
                                                     MaxValueValidator(5)],
                                         help_text='Rating out of 5')

    comment = models.TextField(blank=True, null=True,
                               help_text='Comment left by the host')

    created_at = models.DateTimeField(default=timezone.now,
            help_text='Time when the comment was created')

    def __str__(self):
        return f'{self.host.username} rated {self.guest.username} ' \
               f'{self.rating} stars'

#comment and rating left by a guest for a host(his property)
class HostRating(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='host_ratings_received',
                             help_text='Host who is being rated')

    guest = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name='host_ratings_given',
                              help_text='Guest who is leaving the rating about the host')

    property = models.ForeignKey(Property, on_delete=models.CASCADE,
                                 related_name='host_ratings',
                                 help_text='Property the guest stayed at')

    rating = models.PositiveIntegerField(validators=[MinValueValidator(1),
                                                     MaxValueValidator(5)],
                                         help_text='Rating out of 5')

    comment = models.TextField(blank=True, null=True,
                               help_text='Comment left by the guest')

    created_at = models.DateTimeField(default=timezone.now,
            help_text='Time when the comment was created')

    def __str__(self):
        return f'{self.guest.username} rated {self.host.username} {self.rating} stars'

#comment and rating left by a host for a guest
class GuestRating(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='guest_ratings_given',
                             help_text='Host who is leaving the rating about the guest')

    guest = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name='guest_ratings_received',
                              help_text='Guest who is being rated')

    property = models.ForeignKey(Property, on_delete=models.CASCADE,
                                 related_name='guest_ratings',
                                 help_text='Property the guest stayed at')

    rating = models.PositiveIntegerField(validators=[MinValueValidator(1),
                                                     MaxValueValidator(5)],
                                         help_text='Rating out of 5')

    created_at = models.DateTimeField(default=timezone.now,
            help_text='Time when the comment was created')

    comment = models.TextField(blank=True, null=True,
                               help_text='Comment left by the host')

    def __str__(self):
        return f'{self.host.username} rated {self.guest.username} {self.rating} stars'