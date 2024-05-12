from django.db import models

# Create your models here.
class User(models.Model):
    name=models.TextField()
    password=models.TextField()
    created_at=models.DateTimeField()
    updated_at=models.DateTimeField(null=True)

class Post(models.Model):
    content=models.TextField()
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_posts")
    created_at=models.DateTimeField()

class Room(models.Model):
    created_at=models.DateTimeField()
    users=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_rooms")
    name=models.CharField(max_length=100)

class Message(models.Model):
    room_id=models.ForeignKey(Room,on_delete=models.CASCADE,related_name="room_messages")
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_messages")
    message=models.TextField()
    
