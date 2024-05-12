from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import generics
from SNS.models import User, Post, Message, Room
from SNS.serializers import PostSerializer,UserSerealizer,MessageSerealizer,RoomSerealizer
import json
from django.contrib import messages

def hello(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"message": "Hello world from Django!"})

@csrf_exempt
@api_view(["GET","POST","Update","Delete"])
def App(request):
    posts=Post.objects.all()
    serealizer=PostSerializer(posts)
    posts=[post.message for post in serealizer]
    if request.method=="GET":
        return JsonResponse({"message":posts})
    if request.method=="POST":
        serealizer.save()
        return JsonResponse({"message":"success!"})
    if request.method=="PUT":
        fixed_post=request.data
        pre_post=None
        for post in posts:
            if post.id==fixed_post.id:
                pre_post=post
                break
        serealizer=PostSerializer(pre_post,data=fixed_post)
        return JsonResponse({"message":"success!"})
    if request.method=="DELETE":

        return JsonResponse({"message":"success!"})
