from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import generics
from SNS.models import User, Post, Message, Room
from SNS.serializers import PostSerializer,UserSerializer,MessageSerializer,RoomSerializer
import json
from django.contrib import messages

def hello(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"message": "Hello world from Django!"})

@csrf_exempt
@api_view(["GET","POST","Update","Delete"])
def App(request):
    posts=Post.objects.all()
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
        return JsonResponse(serializer_post.errors, status=400)
        
    if request.method=="PUT":
        fixed_post=request.data
        pre_post=None
        for post in posts:
            if post.id==fixed_post.id:
                pre_post=post
                break
        serializer=PostSerializer(pre_post,data=fixed_post)
        if serializer.is_valid():
            return JsonResponse({"message":"success!"})
        return JsonResponse(serializer.errors,status=400)
    
    if request.method=="DELETE":
        delete_post=request.data     #削除したポスト
        serializer=PostSerializer(data=delete_post)
        if serializer.is_valid():    #データ検証
            return JsonResponse({"message":"success!"},status=201)
        return JsonResponse(serializer.errors,status=400)


def App_modify(request):
    posts=Post.objects.all()
    if request.method=="PUT":
        fixed_post=request.data
        pre_post=None
        for post in posts:
            if post.id==fixed_post.id:
                pre_post=post
                break
        serializer=PostSerializer(pre_post,data=fixed_post)
        if serializer.is_valid():
            return JsonResponse({"message":"success!"})
        return JsonResponse(serializer.errors,status=400)
    
    if request.method=="DELETE":
        delete_post=request.data
        serializer=PostSerializer(delete_post)
        if serializer.is_valid():
            return JsonResponse({"message":"success!"},status=201)
        return JsonResponse(delete_post.errors,status=400)


####ここからチャットアプリの実装###


#APIが要件定義にないもの
def chat(request):
    rooms=Room.objects.all()
    rooms=[room for room in rooms]
    if request.method=="GET":
        return JsonResponse({"message":rooms["id"]})
    
    if request.method=="POST":
        data = request.data.copy()  # リクエストデータのコピーを作成
        # カラム名を変更
        data['created_at'] = data.pop('date', None)
        data['user'] = data.pop('user_id', None)
        serializer_post = RoomSerializer(data=data)  # シリアライザをデータとともにインスタンス化
        if serializer_post.is_valid():  # データの検証
            serializer_post.save()  # データの保存
            return JsonResponse({"message": "Success!"}, status=201)
        return JsonResponse(serializer_post.errors, status=400)
        
    #roomに関しては名前のみしか変更させない（もしくはまったく変更させない）のが望ましい
    if request.method=="PUT":
        fixed_room=request.data.copy()
        pre_room=None
        for room in rooms:
            if room.id==fixed_room.id:
                pre_room=room
                break
        serializer=PostSerializer(pre_room,data=fixed_room)
        if serializer.is_valid():
            return JsonResponse({"message":"success!"})
        return JsonResponse(serializer.errors,status=400)
    
    if request.method=="DELETE":
        delete_room=request.data.copy()     #削除したポスト
        serializer=PostSerializer(data=delete_room)
        if serializer.is_valid():    #データ検証
            return JsonResponse({"message":"success!"},status=201)
        return JsonResponse(serializer.errors,status=400)

#APIが要件定義にある
def chatroom(request):
    rooms=Room.objects.all()
    #ルーム内でメッセージを送信
    if request.method=="POST":
        serializer=RoomSerializer(rooms)
     

