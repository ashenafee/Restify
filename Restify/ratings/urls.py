from django.urls import path
from . import views

app_name = 'reviews'

urlpatterns = [
    path('users/<int:user_id>/ratings/',
         views.RatingListAPIView.as_view(), name='rating_list'),
    # path('users/<int:user_id>/ratings/create/',
    #      views.RatingCreateAPIView.as_view(), name='rating_create'),
    # path('users/<int:user_id>/ratings/<int:pk>/',
    #      views.RatingRetrieveUpdateDestroyAPIView.as_view(), name='rating_detail'),
]
