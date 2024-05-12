from django.contrib import admin
from .models import Post, Room, Message, User

admin.site.register(Post)
admin.site.register(Room)
admin.site.register(Message)
admin.site.register(User)