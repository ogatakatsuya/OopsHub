from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import generics
from SNS.models import User, Post, Message, Room, Like
import json
from django.contrib import messages
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from .models import Post, Like, DontMind
from .serializers import PostSerializer, LikeSerializer, DontMindSerializer, RoomSerializer

def hello(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"message": "Hello world from Django!"})


### CRUD機能 ###

@csrf_exempt # テスト用、実際は外す必要あり
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

###いいね機能###
class ButtonCreateDestroyView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        user = get_object_or_404(User, id=user_id)
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, id=post_id)
        
        # 既存のインスタンスをチェック
        instance = self.get_model().objects.filter(user=user, post=post).first()
        if instance:
            return Response({"message": f"{self.get_model().__name__} already exists"}, status=status.HTTP_200_OK)
        
        # データのシリアライズとバリデーション
        data = {'user': user.id, 'post': post.id}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        # データの保存
        instance = self.get_model().objects.create(user=user, post=post)
        return Response({"message": f"{self.get_model().__name__} created"}, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        user = request.data.get('user')
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, id=post_id)
        instance = self.get_model().objects.filter(user=user, post=post).first()
        if instance:
            instance.delete()
            return Response({"message": f"{self.get_model().__name__} deleted"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"message": f"{self.get_model().__name__} doesn't exist"}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, *args, **kwargs):
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, id=post_id)
        serializer = PostSerializer(post)
        return Response({"likes": serializer.data['likes']}, status=status.HTTP_200_OK)

class LikeCreateDestroyView(ButtonCreateDestroyView):
    serializer_class = LikeSerializer

    def get_model(self):
        return Like

class DontMindCreateDestroyView(ButtonCreateDestroyView):
    serializer_class = DontMindSerializer

    def get_model(self):
        return DontMind
    
@csrf_exempt
@api_view(['GET','POST','DELETE'])
def like_create_destroy(request, post_id):
    
    post = get_object_or_404(Post, id=post_id)

    if request.method == 'GET':
        serializer = PostSerializer(post)
        return Response({"likes":serializer.data['likes']}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        user_id = request.data.get('user')
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=user_id)
        like, created = Like.objects.get_or_create(user=user, post=post)
        if created:
            return Response({"message": "Like created"}, status=status.HTTP_201_CREATED)
        return Response({"message": "Like already exists"}, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        user_id = request.data.get('user')
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        user = get_object_or_404(User, id=user_id)
        like = Like.objects.filter(user=user, post=post)
        if like.exists():
            like.delete()
            return Response({"message": "Like deleted"},status=status.HTTP_204_NO_CONTENT)
        return Response({"message": "Like does'nt exist"},status=status.HTTP_404_NOT_FOUND)
    

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
     

