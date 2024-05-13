from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello),
    path('post/',views.App,name="Application"),
    path("post/<int:pk>",views.App_modify,name="modify_app"),
    path("chat/",views.chatrooms,name="chat"),
    path("chat/<int:room_num>",views.chat,name="chatroom"),
]
