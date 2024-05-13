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
    posts=[post.content for post in posts]
    if request.method=="GET":
        return JsonResponse({"message":posts})
    if request.method=="POST":
        data = request.data.copy()  # リクエストデータのコピーを作成
        # カラム名を変更
        data['created_at'] = data.pop('date', None)
        data['user'] = data.pop('user_id', None)
        serializer_post = PostSerializer(data=data)  # シリアライザをデータとともにインスタンス化
        if serializer_post.is_valid():  # データの検証
            serializer_post.save()  # データの保存
            return JsonResponse({"message": "Success!"}, status=201)
        else:
            return JsonResponse(serializer_post.errors, status=400)
    if request.method=="PUT":
        fixed_post=request.data
        pre_post=None
        for post in posts:
            if post.id==fixed_post.id:
                pre_post=post
                break
        serializer=PostSerializer(pre_post,data=fixed_post)
        return JsonResponse({"message":"success!"})
    if request.method=="DELETE":

        return JsonResponse({"message":"success!"})
