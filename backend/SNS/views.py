from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from rest_framework import generics
from SNS.models import User, Post, Like,Contest,Contest_Post
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from .models import Post, Like, DontMind, Learned,Vote
from .serializers import PostSerializer, LikeSerializer, DontMindSerializer, ContestSerializer,PostListSerializer,Contest_PostSerializer,AISolutionSerializer,VoteSerializer, UserSerializer
from litellm import completion
from django.utils import timezone

def hello(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"message": "Hello world from Django!"})

###ユーザー登録###
class SignUpView(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        """GETメソッドでユーザー登録のビューを表示"""
        return Response({"message": "View success"})

    def put(self, request, *args, **kwargs):
        """PUTメソッドでユーザー情報の更新を行う"""
        data = request.data.copy()
        user_id = data.get("user_id")

        # Userオブジェクトの取得、またはデフォルト値で新規作成
        user, created = User.objects.get_or_create(id=user_id, defaults={
            'name': '匿名ユーザー',
            'password': 'defaultpassword',
            'created_at': timezone.now().strftime('%Y/%m/%d %H:%M:%S')
        })

        # データ変更
        data["id"] = data.pop('user_id', None)
        data["name"] = data.pop('user_name', None)

        # シリアライザーを使用してユーザー情報を更新
        serializer = self.get_serializer(user, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "fail", "error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

### CRUD機能 ### 
class PostGETPOSTView(generics.GenericAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs):
        posts = self.get_queryset()
        serializer = PostListSerializer(posts, many=True)
        data = serializer.data
        for post in data:
            post['text'] = post.pop('content', None)
            post['dontminds'] = post.pop('dont_minds', None)
        return Response({"message": data})

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        user_id = data['user_id']
        data['created_at'] = data.pop('date', None)
        data['user'] = data.pop('user_id', None)
        data['content'] = data.pop('text', None)
        solution_content = data.pop('solution', None)
        
        user, created = User.objects.get_or_create(
            id=user_id,
            defaults={
                'name': '匿名ユーザー',
                'password': 'defaultpassword',
                'created_at': timezone.now().strftime('%Y/%m/%d %H:%M:%S')
            }
        )
        data['user'] = user.id
        serializer = self.get_serializer(data=data)
        
        if serializer.is_valid():
            post = serializer.save()
            if solution_content:
                solution_data = {'content': solution_content, 'post': post.id}
                solution_serializer = AISolutionSerializer(data=solution_data)
                if solution_serializer.is_valid():
                    solution_serializer.save()
                    return Response({"message": "Success!", "solution": solution_content}, status=status.HTTP_201_CREATED)
                return Response(solution_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "Success!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        if text=='':
            return Response({"error": "Both text and post_id are required."}, status=status.HTTP_400_BAD_REQUEST)


        # 質問の形式を指定
        example = """
        入力例1:
        本当にやりたいことと向き合っていなかった。

        出力例1:
        小さな一歩から始めよう！まずは好きなことを少しずつやってみる。自分を信じて！みんな失敗するんだよ！大丈夫、君ならきっと成功できる！ファイト！ 💪😊

        入力例2:
        友達が大事にしているものを壊してしまった。

        出力例2:
        失敗は誰にでも起こるもの。まずは正直に事情を話して謝罪しよう。壊れたものが修理可能か確認するか、新しいものを一緒に選びに行こう。心からの行動が信頼を取り戻す第一歩だよ！😊


        入力例3:
        大事な書類を無くしてしまった。

        出力例3:
        もう一度冷静になって、落としちゃった書類を探してみよう。もし見つからなければ、関係者に正直に報告して対策を一緒に考えよう。大丈夫、失敗は次の成功へのステップだからさ！✊😊

        """
        style = """
        出力：励ましの言葉や解決策だけを書く
        """

        question = "失敗："+text+"""
        \n要求：この失敗に対して、解決策と励ましの言葉だけを4行以内で考えてください。これらの文章は失敗と一緒にSNSに投稿されます。また、親友のような口調で論理的に答えて。入力例は出力せずに、出力だけして。
        """+example+style

        """
        モデルを以下から選択、OPENAIとopenrouterなら使用可能
        model=

        "openrouter/openchat/openchat-7b:free"  # 無料
        "gpt-3.5-turbo"
        "gpt-4o"

        """

        try:
            response = completion(
                model="gpt-4o",
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
    serializer_class = VoteSerializer
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

####ここからコンテストの実装###
@csrf_exempt # テスト用、実際は外す必要あり
@api_view(["GET","POST","Update","Delete"])
def contest(request):
    contests=Contest.objects.all()
    if request.method=="GET":
        serializer_get = ContestSerializer(contests, many=True)
        contest_serializers = serializer_get.data
        contests=[]
        for contest_serializer in contest_serializers:
            contest_serializer["contest_id"]=contest_serializer.pop("id")
            contests.append(contest_serializer)
        return Response({"contests": contests})
    
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
        contest_posts=serializer.data
        return JsonResponse({"message":contest_posts,"title":contest.name,"created_at":contest.created_at,"deadline":contest.deadline})
    
    if request.method=="POST":
        data=request.data.copy()
        data["contest_id"]=contest_id
        data["message"]=data.pop('text', None)
        data["user"]=data.get("user_id")
        data["created_at"]=data.get("created_at")
        user_id = data.get("user_id")
        user, created = User.objects.get_or_create(id=user_id, defaults={
        'name': '匿名ユーザー',  # ユーザー名のデフォルト値
        'password': 'defaultpassword',  # デフォルトのパスワード
        'created_at': timezone.now().strftime('%Y/%m/%d %H:%M:%S')  # 現在の日時を設定
    })            
        serializer=Contest_PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            data=serializer.data
            return Response({"message":data["created_at"]})
        return JsonResponse({"error":"contest is not valid","data":data,"errors": serializer.errors})


class PostDeleteView(generics.GenericAPIView):    
    def get(self,request,*args,**kwargs):
        post_id = self.kwargs.get('post_id')
        contest_id=self.kwargs.get("contest_id")
        post=Contest_Post.objects.filter(id=post_id,contest_id=contest_id).all().first()
        if post:
            return JsonResponse({"message":"success"})
        return JsonResponse({"message":"Post not exist"})
    
    def delete(self,request,*args,**kwargs):
        post_id = self.kwargs.get('post_id')
        contest_id=self.kwargs.get("contest_id")
        post = get_object_or_404(Contest_Post, id=post_id,contest_id=contest_id)
        instance = Contest_Post.objects.filter(id=post_id,contest_id=contest_id).first()
        if instance:
            instance.delete()
            return Response({"message": "delete success"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"message": "the post does not exist"}, status=status.HTTP_404_NOT_FOUND)

class ContestDeleteView(generics.GenericAPIView):  
    def get(self,request,*args,**kwargs):
        contest_id=self.kwargs.get("contest_id")
        contest=Contest.objects.filter(id=contest_id).all().first()
        if contest:
            return JsonResponse({"message":"success"})
        return JsonResponse({"message":"Contest not exist"})
    
    def delete(self,request,*args,**kwargs):
        contest_id=self.kwargs.get("contest_id")
        contest = get_object_or_404(Contest,id=contest_id)
        instance = Contest.objects.filter(id=contest_id).first()
        if instance:
            instance.delete()
            return Response({"message": "delete success"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"message": "the post does not exist"}, status=status.HTTP_404_NOT_FOUND)