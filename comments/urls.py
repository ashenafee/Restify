from django.urls import path

from .views import CommentforGuestWriteView

app_name = 'comments'

urlpatterns = [
    path('profile/<int:user_id>/', CommentforGuestWriteView.as_view(), name='write_comment_for_guest'),
]