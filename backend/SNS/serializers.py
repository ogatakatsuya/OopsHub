from rest_framework import serializers
from SNS.models import User, Post, Message, Room

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fileds = '__all__'
