from django.urls import path

from .views import CreateCommentForGuestView, ViewCommentsAboutGuestView, CreateCommentForPropertyView, ViewCommentsAboutPropertyView, CreateReplyToCommentView

app_name = 'comments'

urlpatterns = [
    path('profile/<int:user_id>/<int:reservation_id>/create/', CreateCommentForGuestView.as_view(), name='write_comment_for_guest'),
    path('profile/<int:user_id>/', ViewCommentsAboutGuestView.as_view(), name='view_comments_for_guest'),
    path('property/<int:property_id>/create/', CreateCommentForPropertyView.as_view(), name='write_comment_for_property'),
    path('property/<int:property_id>/', ViewCommentsAboutPropertyView.as_view(), name='view_comments_for_property'),
    path('reply/<int:comment_id>/create/', CreateReplyToCommentView.as_view(), name='write_reply_to_comment'),
]