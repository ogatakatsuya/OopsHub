from rest_framework import serializers
from SNS.models import User, Post, Contest, Contest_Post, Like, DontMind,Learned, AISolution

class AISolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISolution
        fields = ['content']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id","name","passowrd","created_at","updated_at"]

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
    class Meta:
        model=Contest
        fields=["id","created_at","name"]

class Contest_PostSerializer(serializers.ModelSerializer):
    class Meta:
        model=Contest_Post
        fields=["contest_id","user_id","id","message","created_at"]

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
        model = DontMind
        fields = ['id', 'user', 'post']

class LearnedSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    class Meta:
        model = Learned
        fields = ['id', 'user', 'post']