from django.contrib.auth.models import AbstractUser
from django.db import models
from accounts.models import User
from django.core.exceptions import ValidationError


#similar to Movie model from midterm
class Amenity(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


# Create your models here.
class Property(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    description = models.TextField()
    guests = models.PositiveIntegerField()
    beds = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()
    location = models.CharField(max_length=200)

    #should be later inherited from Rating model
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)

    #one property can have many amenities and one amenity can be in many properties
    amenities = models.ManyToManyField(Amenity, blank = True)

    def __str__(self):
        return f"{self.host.get_full_name()}: {self.name}"

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
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.property}: {self.start_date} - {self.end_date}"

    # it's made so that we can't create overlapping availabilities for the same property
    def save(self, *args, **kwargs):
        for availability in self.property.availabilitiesOfProperty.exclude(id=self.id):
            if availability.start_date <= self.end_date and self.start_date <= availability.end_date:
                raise ValidationError('Overlapping availability already exists for this property.')
            if self.start_date > self.end_date:
                raise ValidationError('Start date must be before end date.')
        super().save(*args, **kwargs)


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

    def __str__(self):
        return f"({self.property}) {self.guest} - {self.start_date} - {self.end_date}"