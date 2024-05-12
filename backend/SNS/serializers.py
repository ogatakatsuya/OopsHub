from rest_framework import serializers
from SNS.models import User, Post, Message, Room

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['text',"id","created_at"]

class UserSerealizer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id","name","passowrd","created_at","updated_at"]

class MessageSerealizer(serializers.ModelSerializer):
    class Meta:
        model=Message
        fields=["id","user","message","room_id"]

class RoomSerealizer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=["id","created_at","users","name"]
