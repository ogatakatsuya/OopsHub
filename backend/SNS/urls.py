from django.urls import path
from . import views
from .views import LikeCreateDestroyView, DontMindCreateDestroyView


urlpatterns = [
    path('', views.hello),
    path('post/',views.App,name="Application"),
    path("post/<int:pk>",views.App_modify,name="modify_app"),
    path("chat/",views.chat,name="chat"),
    path("chat/<int:room_num>",views.chatroom,name="chatroom"),
    path('like/<int:post_id>/',  LikeCreateDestroyView.as_view(), name='like-create-destroy'),
    path('dontmind/<int:post_id>/', DontMindCreateDestroyView.as_view(), name='dontmind-create-destroy'),
]
