from django.urls import path
from . import views


urlpatterns = [
    path('', views.hello),
    path('post/',views.PostView.as_view(),name="Post_get_post"),
    path("post/<int:pk>",views.App_modify,name="modify_app"),
    path("contest/",views.contest,name="contest"),
    path("contest/<int:contest_id>",views.ContestDeleteView.as_view(),name="contest-delete"),
    path("contest/<int:contest_id>/post",views.contestroom,name="contestroom"),
    path("name",views.SignUpView.as_view(),name="signup"),
    path("contest/<int:contest_id>/post/<int:post_id>",views.PostDeleteView.as_view(),name="delete-post"),
    path("contest/<int:post_id>/vote",views.VoteCreateDestroyView.as_view(),name="vote-create"),
    path('like/<int:post_id>/',  views.LikeCreateDestroyView.as_view(), name='like-create-destroy'),
    path('dontmind/<int:post_id>/', views.DontMindCreateDestroyView.as_view(), name='dontmind-create-destroy'),
    path('learned/<int:post_id>/', views.LearnedCreateDestroyView.as_view(), name='learned-create-destroy'),
    path('api/',views.LLMView.as_view(),name='AI-solution'),
]
