from django.urls import path
from . import views

app_name = 'ratings'

urlpatterns = [
    path('view/<int:user_id>',
         views.RatingListAPIView.as_view(), name='rating_list'),
    path('create/',
         views.RatingCreateAPIView.as_view(), name='rating_create'),
    # path('users/<int:user_id>/ratings/<int:pk>/',
    #      views.RatingRetrieveUpdateDestroyAPIView.as_view(), name='rating_detail'),
]
