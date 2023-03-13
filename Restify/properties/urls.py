from django.urls import path

from .views import propertyCreateView,propertyImageCreateView,ReservationCreateView, PropertyUpdateView,ReservationUpdateStateView

app_name = 'properties'

urlpatterns = [
    path('property/add/', propertyCreateView.as_view(), name='property_create'),
    path('images/<int:property_id>/add/',propertyImageCreateView.as_view(), name='image_add'),
    path('reservation/<int:property_id>/add/', ReservationCreateView.as_view(), name='reservation_add'),
    path('property/<int:property_id>/edit/', PropertyUpdateView.as_view(), name='property_update'),
    path('reservation/<int:reservation_id>/update/', ReservationUpdateStateView.as_view(), name='reservation_update'),
]