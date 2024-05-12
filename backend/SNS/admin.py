from django.contrib import admin
from .models import Post, Room, Message

admin.site.register(Post)
admin.site.register(Room)
admin.site.register(Message)