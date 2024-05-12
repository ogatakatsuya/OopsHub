from rest_framework import serializers
from SNS.models import User, Post, Message, Room

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['content']

    def to_representation(self, instance):
        # インスタンスの content フィールドの値だけを返す
        return instance.content

