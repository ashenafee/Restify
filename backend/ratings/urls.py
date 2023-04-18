from django.urls import path
from . import views

app_name = 'ratings'

urlpatterns = [
    path('view/<int:user_id>',
         views.RatingListAPIView.as_view(), name='rating_list'),
    path('create/',
         views.RatingCreateAPIView.as_view(), name='rating_create'),
    path('host/create/', views.HostRatingCreateAPIView.as_view(), name='host_rating_create'),
    path('host/list/<int:user_id>', views.HostRatingListAPIView.as_view(), name='host_rating_list'),
    path('guest/create/', views.GuestRatingCreateAPIView.as_view(), name='guest_rating_create'),
    path('guest/list/<int:user_id>', views.GuestRatingListAPIView.as_view(), name='guest_rating_list'),
]
