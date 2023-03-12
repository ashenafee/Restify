from django.contrib.auth.models import AbstractUser
from django.db import models
from accounts.models import User

#similar to Movie model from midterm
class Amenity(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

# Create your models here.
class Property(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    address = models.CharField(max_length=200)
    description = models.TextField()
    guests = models.PositiveIntegerField()
    beds = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()

    #one property can have many amenities and one amenity can be in many properties
    amenities = models.ManyToManyField(Amenity, blank = True)

class PropertyImage(models.Model):
    name = models.CharField(max_length=255)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/')
    default = models.BooleanField(default=False)

#one Property object can have multiple Availability objects, but an Availability object can only belong to one Property
class Availability(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='availabilitiesOfProperty')
    start_date = models.DateField()
    end_date = models.DateField()
    # we will set the price for the whole period, not for each day
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.property}: {self.start_date} - {self.end_date}"


class Reservation(models.Model):
    PENDING = 'Pending'
    DENIED = 'Denied'
    EXPIRED = 'Expired'
    APPROVED = 'Approved'
    CANCELED = 'Canceled'
    TERMINATED = 'Terminated'
    COMPLETED = 'Completed'
    RESERVATION_STATES = [
        (PENDING, 'Pending'),
        (DENIED, 'Denied'),
        (EXPIRED, 'Expired'),
        (APPROVED, 'Approved'),
        (CANCELED, 'Canceled'),
        (TERMINATED, 'Terminated'),
        (COMPLETED, 'Completed'),
    ]

    #one property can have many reservations and one reservation belongs to one property
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='reservationsOfProperty')

    #a reservation belongs to one guest, and a guest can have multiple reservations
    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservationsOfGuest')

    start_date = models.DateField()
    end_date = models.DateField()
    state = models.CharField(choices=RESERVATION_STATES, default=PENDING, max_length=200)