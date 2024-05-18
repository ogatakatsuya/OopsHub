from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import generics
from SNS.models import User, Post, Like,Contest,Contest_Post
import json
from django.contrib import messages
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from .models import Post, Like, DontMind, Learned,Vote, AISolution
from .serializers import PostSerializer, LikeSerializer, DontMindSerializer, ContestSerializer,PostListSerializer,Contest_PostSerializer,AISolutionSerializer
import os
from dotenv import load_dotenv
from litellm import completion
import time

def hello(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"message": "Hello world from Django!"})


### CRUD機能 ###

@csrf_exempt # テスト用、実際は外す必要あり
@api_view(["GET","POST","Update","Delete"])
def App(request):
    posts=Post.objects.all()
    
    if request.method=="GET":
        serializer_get = PostListSerializer(posts, many=True)
        posts = serializer_get.data
        for post in posts:
            post['text'] = post.pop('content', None)
            post['dontminds'] = post.pop('dont_minds', None)
        return Response({"message": posts})
    
    if request.method=="POST":
        data = request.data.copy()  # リクエストデータのコピーを作成
        # カラム名を変更
        data['created_at'] = data.pop('date', None)
        data['user'] = data.pop('user_id', None)
        data['content'] = data.pop('text', None)
        solution_content = data['solution']
        serializer_post = PostSerializer(data=data)  # シリアライザをデータとともにインスタンス化
        if serializer_post.is_valid():  # データの検証
            post = serializer_post.save()  # データの保存
            # solutionデータがある場合は、AISolutionとして保存
            if solution_content is not None:
                solution_data = {'content': solution_content, 'post': post.id}
                serializer_solution = AISolutionSerializer(data=solution_data)
                if serializer_solution.is_valid():
                    serializer_solution.save()  # AISolutionデータの保存
                else:
                    return JsonResponse(serializer_solution.errors, status=400)
            return JsonResponse({"message": "Success!","solution":solution_content}, status=201)
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

###AIとのやり取り###
class LLMView(generics.GenericAPIView):

    def post(self, request):
        # リクエストボディからデータを取得
        text = request.data.get('text', '')

        # データの検証
        if not text:
            return Response({"error": "Both text and post_id are required."}, status=status.HTTP_400_BAD_REQUEST)


        # 質問の形式を指定
        question = f"次の失敗について：「{text}」、具体的な解決策と励ましの言葉を3行以内以上で会話するような口調で提供してください。"

        # .envファイルの読み込み
        load_dotenv()

        """
        model=

        "openrouter/openchat/openchat-7b:free"  # 無料
        "gpt-3.5-turbo"
        "gpt-4o"

        """

        try:
            response = completion(
                model="gpt-3.5-turbo",
                messages=[{"content": question, "role": "user"}],
            ) # API KEYは.envで設定されている
        except Exception as e:
            return Response({"error": "Error processing your request.", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"solution":response["choices"][0]['message']['content']}, status=status.HTTP_200_OK)


###ボタン機能(いいね(likes),ドンマイ(dontmind),ためになった(learned),投票(Vote))###
class ButtonCreateDestroyView(generics.GenericAPIView):

    def get_model(self):
        raise NotImplementedError("Subclasses must implement this method.")
    
    def post(self, request, *args, **kwargs):
        user = request.data.get('user')
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(self.format, id=post_id)
        
        # 既存のインスタンスをチェック
        instance = self.get_model().objects.filter(user=user, post=post).first()
        if instance:
            count = getattr(post, self.field_name).count()
            return Response({"message": f"{self.get_model().__name__} already exists", self.field_name: count}, status=status.HTTP_200_OK)
        
        # データのシリアライズとバリデーション
        data = {'user': user, 'post': post.id}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        # データの保存
        instance = self.get_model().objects.create(user=user, post=post)
        count = getattr(post, self.field_name).count()
        return Response({"message": f"{self.get_model().__name__} created", self.field_name: count}, status=status.HTTP_201_CREATED)
    

    def delete(self, request, *args, **kwargs):
        user = request.data.get('user')
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(self.format, id=post_id)
        instance = self.get_model().objects.filter(user=user, post=post).first()
        if instance:
            instance.delete()
            count = getattr(post, self.field_name).count()
            return Response({"message": f"{self.get_model().__name__} deleted", self.field_name: count}, status=status.HTTP_204_NO_CONTENT)
        count = getattr(post, self.field_name).count()
        return Response({"message": f"{self.get_model().__name__} doesn't exist", self.field_name: count}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, *args, **kwargs):
        if self.field_name is None:
            return Response({"error": "Field name not set"}, status=status.HTTP_400_BAD_REQUEST)

        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(self.format, id=post_id)
        serializer = self.serializer_format(post)
        return Response({self.field_name: serializer.data[self.field_name]}, status=status.HTTP_200_OK)

#format：ボタンがどういったものに対して押されるか
#serializer_format:formatのシリアライザー
class VoteCreateDestroyView(ButtonCreateDestroyView):
    serializer_class = LikeSerializer
    field_name = 'votes'
    format=Contest_Post
    serializer_format=Contest_PostSerializer
    def get_model(self):
        return Vote

class LikeCreateDestroyView(ButtonCreateDestroyView):
    serializer_class = LikeSerializer
    field_name = 'likes'
    format=Post
    serializer_format=PostSerializer
    def get_model(self):
        return Like

class DontMindCreateDestroyView(ButtonCreateDestroyView):
    serializer_class = DontMindSerializer
    field_name = 'dont_minds'
    format=Post
    serializer_format=PostSerializer
    def get_model(self):
        return DontMind
    
class LearnedCreateDestroyView(ButtonCreateDestroyView):
    serializer_class = DontMindSerializer
    field_name = 'learneds'
    format=Post
    serializer_format=PostSerializer
    def get_model(self):
        return Learned

####ここからチャットアプリの実装###
@csrf_exempt # テスト用、実際は外す必要あり
@api_view(["GET","POST","Update","Delete"])
def contest(request):
    contests=Contest.objects.all()
    if request.method=="GET":
        serializer_get = ContestSerializer(contests, many=True)
        contests = serializer_get.data
        return Response({"message": contests})
    
    if request.method=="POST":
        data=request.data.copy()
        serializer_contest = ContestSerializer(data=data)  # シリアライザをデータとともにインスタンス化
        if serializer_contest.is_valid():  # データの検証
            serializer_contest.save()  # データの保存
            data=serializer_contest.data
            return JsonResponse({"message": "success"}, status=201)
        return JsonResponse(serializer_contest.errors, status=400)
    
    if request.method=="DELETE":
        delete_room=request.data.copy()     #削除したポスト
        serializer=PostSerializer(data=delete_room)
        if serializer.is_valid():    #データ検証
            return JsonResponse({"message":"success"},status=201)
        return JsonResponse(serializer.errors,status=400)

@csrf_exempt # テスト用、実際は外す必要あり
@api_view(["GET","POST","Update","Delete"])
def contestroom(request,contest_id):
    try:
        contest = Contest.objects.get(id=contest_id)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Contest not found'}, status=404)
    
    contest_posts=Contest_Post.objects.filter(contest_id=contest_id).all().order_by("-id")#古い順に並べてある
    if request.method=="GET":
        serializer=Contest_PostSerializer(contest_posts,many=True)
        votes=[getattr(post, "votes").count() for post in contest_posts]
        contest_posts=serializer.data
        title=contest.name
        posts=[]
        for contest in contest_posts:
            contest["title"]=title
            posts.append(contest)
        return JsonResponse({"message":posts})
    
    if request.method=="POST":
        data=request.data.copy()
        data["contest_id"]=contest_id
        data["message"]=data.get("text")
        data["user_id"]=data.get("user_id")
        data["created_at"]=data.get("created_at")
        serializer=Contest_PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            data=serializer.data
            return JsonResponse({"message":data["created_at"]})


class PostDeleteView(generics.GenericAPIView):
    def get_model(self):
        raise NotImplementedError("Subclasses must implement this method.")
    
    def get(self,request,*args,**kwargs):
        user_id = request.data.get('user')
        post_id = self.kwargs.get('post_id')
        contest_id=self.kwargs.get("contest_id")
        post=Contest_Post.objects.filter(id=post_id,contest_id=contest_id).all().first()
        if post:
            return JsonResponse({"message":"success"})
        return JsonResponse({"message":"Post not exist"})
    
    def delete(self,request,*args,**kwargs):
        user_id = request.data.get('user')
        post_id = self.kwargs.get('post_id')
        contest_id=self.kwargs.get("contest_id")
        post = get_object_or_404(Contest_Post, post_id=post_id,contest_id=contest_id)
        instance = self.get_model().objects.filter(user_id=user_id, post=post).first()
        if instance:
            instance.delete()
            return Response({"message": "delete success"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"message": "the post does not exist"}, status=status.HTTP_404_NOT_FOUND)
