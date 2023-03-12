from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from accounts.models import User


class Rating(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE,
                                 related_name='reviewer')
    rated_user = models.ForeignKey(User, on_delete=models.CASCADE,
                                   related_name='rated_user')
    #property = models.ForeignKey(Property, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=0,
                                         validators=[MinValueValidator(1),
                                                     MaxValueValidator(5)])
    comment = models.TextField(blank=True)

    class Meta:
        # unique_together = ('reviewer', 'rated_user', 'property')
        unique_together = ('reviewer', 'rated_user')

