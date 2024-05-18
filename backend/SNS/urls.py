from django.urls import path
from . import views
from .views import LikeCreateDestroyView, DontMindCreateDestroyView,LearnedCreateDestroyView,LLMView,VoteCreateDestroyView,ContestDeleteView


urlpatterns = [
    path('', views.hello),
    path('post/',views.App,name="Application"),
    path("post/<int:pk>",views.App_modify,name="modify_app"),
    path("contest/",views.contest,name="contest"),
    path("contest/<int:contest_id>",ContestDeleteView.as_view(),name="contest-delete"),
    path("contest/<int:contest_id>/post",views.contestroom,name="contestroom"),
    path("contest/<int:contest_id>/post/<int:post_id>",views.PostDeleteView.as_view(),name="delete-post"),
    path("contest/<int:post_id>/vote",VoteCreateDestroyView.as_view(),name="vote-create"),
    path('like/<int:post_id>/',  LikeCreateDestroyView.as_view(), name='like-create-destroy'),
    path('dontmind/<int:post_id>/', DontMindCreateDestroyView.as_view(), name='dontmind-create-destroy'),
    path('learned/<int:post_id>/', LearnedCreateDestroyView.as_view(), name='learned-create-destroy'),
    path('api/',LLMView.as_view(),name='AI-solution'),
]
