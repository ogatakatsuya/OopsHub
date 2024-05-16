from django.urls import path
from . import views
from .views import LikeCreateDestroyView, DontMindCreateDestroyView


urlpatterns = [
    path('', views.hello),
    path('post/',views.App,name="Application"),
    path("post/<int:pk>",views.App_modify,name="Application_modify"),
    path("contest/",views.contest,name="contest"),
    path("contest/<int:contest_id>/post",views.contestroom,name="contestroom"),
    path("contest/<int:contest_id>/post/<int:post_id>",views.PostDeleteView.as_view(),name="contestroom"),
    path('like/<int:post_id>/',  LikeCreateDestroyView.as_view(), name='like-create-destroy'),
    path('dontmind/<int:post_id>/', DontMindCreateDestroyView.as_view(), name='dontmind-create-destroy'),
]
