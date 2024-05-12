from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello, name='SNS'),
    path('posts/',views.post_list),
]
