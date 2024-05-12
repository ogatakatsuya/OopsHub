from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello),
    path('post/',views.App,name="Application"),
]
