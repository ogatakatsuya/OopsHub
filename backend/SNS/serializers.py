from rest_framework import serializers
from SNS.models import User, Post, Message, Room

class UserSerealizer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id","name","passowrd","created_at","updated_at"]

class PostSerializer(serializers.ModelSerializer):
    text=serializers.CharField()
    created_at=serializers.DateTimeField(required=False)
    class Meta:
        model = Post
        fields = ["id","text","created_at","user"]
    def create(self,validated_data):
        text=validated_data.get("text")
        created_at=validated_data.get("created_at")
        user=validated_data.get("user")
        



class MessageSerealizer(serializers.ModelSerializer):
    class Meta:
        model=Message
        fields=["id","user","message","room_id"]

class RoomSerealizer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=["id","created_at","users","name"]
