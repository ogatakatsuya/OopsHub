from django.db import models

# Create your models here.
class User(models.Model):
    name=models.CharField(max_length=100)
    password=models.CharField(max_length=100)
    created_at=models.DateTimeField()
    updated_at=models.DateTimeField(null=True)
    def __str__(self):
        return self.name

class Post(models.Model):
    content=models.CharField(max_length=100)
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_posts")
    created_at=models.DateTimeField()
    def __str__(self):
        return self.content

class Room(models.Model):
    created_at=models.DateTimeField()
    users=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_rooms")
    name=models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Message(models.Model):
    room_id=models.ForeignKey(Room,on_delete=models.CASCADE,related_name="room_messages")
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_messages")
    message=models.CharField(max_length=100)
    def __str__(self):
        return self.message
    
