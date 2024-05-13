from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from SNS.models import Post
from SNS.serializers import PostSerializer
import json

def hello(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"message": "Hello world from Django!"})

@csrf_exempt
def post_list(request,pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return HttpResponse(status=404)
    
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts,many=True)
        return JsonResponse({'message': serializer.data})

