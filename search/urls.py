from django.urls import path

from .views import PropertySearchView

app_name = 'search'

urlpatterns = [
    path('catalog/', PropertySearchView.as_view(), name='search_catalog'),
    # path('<int:property_id>/',PropertyView.as_view(), name='property_view'),
]