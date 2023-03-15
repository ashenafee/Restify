from django.urls import path

from .views import LoginView, LogoutView, SignupView, EditProfileView
#from comments.views import CommentforGuestWriteView, PropertyCommentCreateAPIView, GuestCommentListAPIView

app_name = 'accounts'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('edit/', EditProfileView.as_view(), name='edit_profile'),
    #path('profile/<int:user_id>', CommentforGuestWriteView.as_view(), name='write_comment_for_guest'),
]


