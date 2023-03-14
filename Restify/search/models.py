from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from accounts.models import User
from properties.models import Amenity, PropertyImage, Availability, Property