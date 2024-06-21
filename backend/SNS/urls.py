from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello),
    path('post/',views.PostGETPOSTView.as_view(),name="postGETPOST"),
    path("post/<int:pk>",views.PostModifyView.as_view(),name="postModify"),
    path("contest/",views.ContestView.as_view(),name="contest"),
    path("contest/<int:contest_id>",views.ContestDeleteView.as_view(),name="contest-delete"),
    path("contest/<int:contest_id>/post",views.ContestRoomView.as_view(),name="contestroom"),
    path("name",views.SignUpView.as_view(),name="signup"),
    path("contest/<int:contest_id>/post/<int:post_id>",views.PostDeleteView.as_view(),name="delete-post"),
    path("contest/<int:post_id>/vote",views.VoteCreateDestroyView.as_view(),name="vote-create"),
    path('like/<int:post_id>/',  views.LikeCreateDestroyView.as_view(), name='like-create-destroy'),
    path('dontmind/<int:post_id>/', views.DontMindCreateDestroyView.as_view(), name='dontmind-create-destroy'),
    path('learned/<int:post_id>/', views.LearnedCreateDestroyView.as_view(), name='learned-create-destroy'),
    path('api/',views.LLMView.as_view(),name='AI-solution'),
]
