from django.contrib import admin
from .models import Post, Contest, Contest_Post, User

admin.site.register(Post)
admin.site.register(Contest)
admin.site.register(Contest_Post)
admin.site.register(User)