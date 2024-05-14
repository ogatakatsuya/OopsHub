from rest_framework import serializers
from SNS.models import User, Post, Message, Room, Like

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id","name","passowrd","created_at","updated_at"]

class PostSerializer(serializers.ModelSerializer):
    content=serializers.CharField()
    created_at=serializers.DateTimeField()
    likes = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ["id","content","created_at","user","likes"]
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



class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=Message
        fields=["id","user","message","room_id"]

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=["id","created_at","users","name"]

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    class Meta:
        model = Like
        fields = ['id', 'user', 'post']