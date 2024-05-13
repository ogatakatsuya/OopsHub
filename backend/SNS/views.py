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

@csrf_exempt # テスト用、実際は外す必要あり
@api_view(["GET","POST","PUT","Delete"])#HTTP methodsしか入れられない（Updateはなかった）
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
        data['content'] = data.pop('text', None)
        serializer_post = PostSerializer(data=data)  # シリアライザをデータとともにインスタンス化
        if serializer_post.is_valid():  # データの検証
            serializer_post.save()  # データの保存
            return JsonResponse({"message": "Success!"}, status=201)
        return JsonResponse(serializer_post.errors, status=400)
        
    if request.method=="PUT":
        data = request.data.copy()  # リクエストデータのコピーを作成
        # カラム名を変更
        data['updated_at'] = data.pop('date', None)
        data['user'] = data.pop('user_id', None)
        data['content'] = data.pop('text', None)
        fixed_post=data
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

#投稿
@csrf_exempt # テスト用、実際は外す必要あり
@api_view(["PUT","DELETE"])
def App_modify(request,pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)
    
    if request.method=="PUT":
        data = request.data.copy()  # リクエストデータのコピーを作成
        # カラム名を変更
        data['created_at'] = data.pop('date', None)
        data['user'] = data.pop('user_id', None)
        data['content'] = data.pop('text', None)
        serializer = PostSerializer(post,data=data)  # シリアライザをデータとともにインスタンス化
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "success!"})
        return JsonResponse(serializer.errors, status=400)
    
    if request.method == "DELETE":
        try:
            delete_post = Post.objects.get(pk=pk)
            delete_post.delete()
            return JsonResponse({"message": "success!"}, status=204)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)

####ここからチャットアプリの実装###


#チャットルームのリスト
@api_view(["PUT","DELETE","GET","POST"])
def chatrooms(request):
    user=request.data
    rooms=Room.objects.filter(users=user)
    rooms=[room for room in rooms]
    if request.method=="GET":
        room_ids=[room.id for room in rooms]#名前で返す
        return JsonResponse({"message":room_ids})
    
    if request.method=="POST":
        data = request.data.copy()  # リクエストデータのコピーを作成
        # カラム名を変更
        data['created_at'] = data.pop('date', None)
        data['user'] = data.pop('user_id', None)
        data["name"]=data.pop("name")
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

#チャットルーム
@api_view(["POST","DELETE","GET"])
def chat(request,room_num):
    rooms=Room.objects.all()
    #ルーム内でメッセージを送信
    if request.method=="POST":
        serializer=RoomSerializer(rooms)
    if request.method=="GET":
        try:
            room=Room.objects().filter(id=room_num)[0]
            messages=Message.objects().filter(room_id=room).ordered_by("-id")
            messages=[message.message for message in messages]
            return JsonResponse({"message":messages})
        except BaseException as e:
            return JsonResponse({"message":"An Error Occure!"})
    
    if request.method=="DELETE":
        delete_message=request.data.copy()
        serializer=MessageSerializer(data=delete_message)
        if serializer.is_valid():
            return JsonResponse({"message":"success!"})
        return JsonResponse(serializer.errors,status=400)
