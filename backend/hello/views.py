from django.core.handlers.wsgi import WSGIRequest
from django.http.response import JsonResponse


def hello(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"message": "Hello world from Django!"})