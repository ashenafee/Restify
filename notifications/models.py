from django.db import models


from accounts.models import User
from ratings.models import Rating
from properties.models import Reservation
from comments.models import GuestComment

# Create your models here.


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=100, default='notification')

    def __str__(self):
        return self.text


class RatingNotification(Notification):
    rating = models.ForeignKey(Rating, on_delete=models.CASCADE)

    def __str__(self):
        return self.text
    

class GuestCommentNotification(Notification):
    comment = models.ForeignKey(GuestComment, on_delete=models.CASCADE)

    def __str__(self):
        return self.text

class ReservationNotification(Notification):
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)

    def __str__(self):
        return self.text


class CancellationNotification(Notification):
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guest')

    def __str__(self):
        return self.text
