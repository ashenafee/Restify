from django.urls import path

from .views import *
app_name = 'properties'

urlpatterns = [
    path('property/add/', propertyCreateView.as_view(), name='property_create'),
    path('images/<int:property_id>/add/',propertyImageCreateView.as_view(), name='image_add'),
    path('reservation/<int:property_id>/add/', ReservationCreateView.as_view(), name='reservation_add'),
    path('property/<int:property_id>/edit/', PropertyUpdateView.as_view(), name='property_update'),
    path('reservation/<int:reservation_id>/update/', ReservationUpdateStateView.as_view(), name='reservation_update'),
    path('property/<int:property_id>/details/', PropertyDetailView.as_view(), name ='property_details'),
    path('reservation/<int:reservation_id>/cancel/', ReservationCancelView.as_view(), name='reservation_cancel'),
    path('reservation/pastdetails/',ReservationHistoryView.as_view(), name='reservation_history' ),
    path('property/<int:property_id>/host/', HostDetailsView.as_view(), name='property_host'),
    path('property/<int:property_id>/delete/', PropertyDeleteView.as_view(), name ='property_delete'),
    path('reservation/list/',ReservationListView.as_view(), name='reservation_list')
]