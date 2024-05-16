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
    user=models.CharField(max_length=50)
    created_at=models.CharField(max_length=100)
    def __str__(self):
        return self.content

class Contest(models.Model):
    created_at=models.CharField(max_length=50)
    name=models.CharField(max_length=50)
    def __str__(self):
        return self.name

class Contest_Post(models.Model):
    contest_id=models.CharField(max_length=50)
    user_id=models.CharField(max_length=50)
    message=models.CharField(max_length=100)
    def __str__(self):
        return self.message
    


class Button(models.Model):
    user = models.CharField(max_length=50)
    class Meta:
        abstract = True
        unique_together = ('user', 'post')

    def __str__(self):
        pass

class Like(Button):
    post = models.ForeignKey(Post, on_delete=models.CASCADE,related_name='likes')
    def __str__(self):
        return f'{self.user} liked {self.post}'

class DontMind(Button):
    post = models.ForeignKey(Post, on_delete=models.CASCADE,related_name='dont_minds')
    def __str__(self):
        return f'{self.user} cheeruped {self.post}'
    
class Vote(Button):
    post = models.ForeignKey(Contest_Post, on_delete=models.CASCADE,related_name='dont_minds')
    def __str__(self):
        return f'{self.user} cheeruped {self.post}'
    
#   python manage.py runserver
#   python manage.py createsuperuser
#   python manage.py makemigrations