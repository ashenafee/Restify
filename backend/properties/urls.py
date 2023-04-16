from django.urls import path

from .views import *
app_name = 'properties'

urlpatterns = [
    path('property/add/', propertyCreateView.as_view(), name='property_create'),
    path('property/<int:property_id>/availability/', availabilityCreateView.as_view(), name='availability_create'),
    path('property/<int:property_id>/<int:availability_id>/availability_update/', availabilityUpdateView.as_view(), name='availability_update'),
    path('availability/<int:availability_id>/availability_delete/', availabilityDeleteView.as_view(), name='availability_delete'),
    path('property/<int:property_id>/view/', PropertyDetailView.as_view(), name='property_view'),
    path('property/<int:property_id>/edit/', PropertyUpdateView.as_view(), name='property_update'),
    path('property/<int:property_id>/delete/', PropertyDeleteView.as_view(), name ='property_delete'),

    path('images/<int:property_id>/add/',propertyImageCreateView.as_view(), name='image_add'),
    path('images/<int:image_id>/delete/', propertyImageDeleteView.as_view(), name='image_delete'),
    path('images/<int:image_id>/edit/', PropertyImageUpdateView.as_view(), name='image_edit'),

    path('reservation/<int:property_id>/add/', ReservationCreateView.as_view(), name='reservation_add'),
    path('reservation/<int:reservation_id>/update/', ReservationUpdateStateView.as_view(), name='reservation_update'),
    path('reservation/<int:reservation_id>/cancel/', ReservationCancelView.as_view(), name='reservation_cancel'),
    path('reservation/pastdetails/',ReservationHistoryView.as_view(), name='reservation_history' ),
    path('reservation/list/',ReservationListView.as_view(), name='reservation_list'),
    path('reservation/<int:reservation_id>/detail/', ReservationDetailView.as_view(), name='reservation_detail'),

    path('amenity/add/', AmenityCreateView.as_view(), name='amenity_add'),
    path('amenity/<int:amenity_id>/delete/', AmenityDeleteView.as_view(), name='amenity_delete')

    # path('property/<int:property_id>/details/', PropertyDetailView.as_view(), name ='property_details'),
    # path('property/<int:property_id>/host/', HostDetailsView.as_view(), name='property_host'),

]