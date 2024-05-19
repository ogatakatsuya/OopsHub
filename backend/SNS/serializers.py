from rest_framework import serializers
from SNS.models import User, Post, Contest, Contest_Post, Like, DontMind,Learned, AISolution,Vote
import datetime
from datetime import timezone
class AISolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISolution
        fields = ['content','post']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id","user_name","user_id"]

class PostSerializer(serializers.ModelSerializer):
    content=serializers.CharField()
    created_at=serializers.CharField()
    likes = serializers.SerializerMethodField()
    dont_minds = serializers.SerializerMethodField()
    learneds = serializers.SerializerMethodField()
    solution = serializers.SerializerMethodField(default=None)
    class Meta:
        model = Post
        fields = ["id","content","created_at","user","likes","dont_minds","learneds","solution"]
    def create(self,validated_data):
        # リクエストのフィールド名を変更
        content = validated_data.pop('content', validated_data.get('content'))
        created_at = validated_data.pop('created_at', validated_data.get('date'))
        user = validated_data.pop('user', validated_data.get('user_id'))

        # 新しいPostインスタンスを作成
        post = Post.objects.create(
            content=content,
            created_at=created_at,
            user=user
        )
        return post
    
    def get_likes(self, obj):
        return obj.likes.count()

    def get_dont_minds(self, obj):
        return obj.dont_minds.count()
    
    def get_learneds(self, obj):
        return obj.learneds.count()
    
    def get_solution(self, obj):
        
        solution = obj.solution.first()  
        if solution:
            return solution.content
        return None

class PostListSerializer(PostSerializer):
    class Meta(PostSerializer.Meta):
        fields = ["id", "content", "created_at", "likes", "dont_minds","learneds","solution"] 




class ContestSerializer(serializers.ModelSerializer):
    created_at=serializers.CharField(max_length=50)
    name=serializers.CharField(max_length=50)
    deadline=serializers.DateTimeField()
    available=serializers.SerializerMethodField()
    class Meta:
        model=Contest
        fields=["id","created_at","name","available","deadline"]
    def create(self,validated_data):
        # リクエストのフィールド名を変更
        name = validated_data.pop('name', validated_data.get('name'))
        created_at = validated_data.pop('created_at', validated_data.get('created_at'))
        deadline = validated_data.pop('deadline', validated_data.get('deadline'))

        # 新しいPostインスタンスを作成
        contest = Contest.objects.create(
            name=name,
            created_at=created_at,
            deadline=deadline
        )
        return contest
    def get_available(self,obj):
        tokyo_timezone = datetime.timezone(datetime.timedelta(hours=9))
        now_utc=datetime.datetime.now(timezone.utc)
        now = now_utc.astimezone(tokyo_timezone)
        print(now)
        if obj.deadline.timestamp()>=now.timestamp():
            return True
        else:
            return False
    

class Contest_PostSerializer(serializers.ModelSerializer):
    votes = serializers.SerializerMethodField()
    class Meta:
        model=Contest_Post
        fields=["contest_id","user","id","message","created_at","votes"]
    def get_votes(self, obj):
        return obj.votes.count()

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    class Meta:
        model = Like
        fields = ['id', 'user', 'post']

class DontMindSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    class Meta:
        model = DontMind
        fields = ['id', 'user', 'post']

class VoteSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    post = serializers.PrimaryKeyRelatedField(queryset=Contest_Post.objects.all())
    class Meta:
        model = Vote
        fields = ['id', 'user', 'post']

class LearnedSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    class Meta:
        model = Learned
        fields = ['id', 'user', 'post']