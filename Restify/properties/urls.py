from django.urls import path

from .views import propertyCreateView,propertyImageCreateView,ReservationCreateView

app_name = 'properties'

urlpatterns = [
    path('add/', propertyCreateView.as_view(), name='property_create'),
    path('add/<int:property_id>/images/',propertyImageCreateView.as_view(), name='image_add'),
    path('add/<int:property_id>/reservation/', ReservationCreateView.as_view(), name='reservation_add')
]


