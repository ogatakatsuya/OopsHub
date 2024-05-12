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
    
    if request.method=="POST":
        data=json.loads(request.content)
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    
    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = PostSerializer(post, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    if request.method=="DELETE":
        data=json.loads(request.content)
        data.delete()
        return HttpResponse(status=204)
