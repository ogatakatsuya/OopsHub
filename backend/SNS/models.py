from django.db import models

class User(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name=models.CharField(max_length=100, default='匿名ユーザー')
    password=models.CharField(max_length=100)
    created_at=models.CharField(max_length=50)
    updated_at=models.CharField(max_length=50,null=True, blank=True)
    def __str__(self):
        return self.name

class Post(models.Model):
    content=models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at=models.CharField(max_length=100)
    def __str__(self):
        return self.content

class Contest(models.Model):
    created_at=models.CharField(max_length=50)
    name=models.CharField(max_length=50)
    deadline=models.DateTimeField()
    def __str__(self):
        return self.name

class Contest_Post(models.Model):
    contest_id=models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message=models.CharField(max_length=100)
    created_at=models.CharField(max_length=100)
    def __str__(self):
        return self.message
    
class AISolution(models.Model):
    content = models.TextField(null=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE,related_name='solution')

    def __str__(self):
        return self.content

class Button(models.Model):
    user=models.CharField(max_length=100)
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
    post = models.ForeignKey(Contest_Post, on_delete=models.CASCADE,related_name='votes')
    def __str__(self):
        return f'{self.user} voted {self.post}'
 
class Learned(Button):
    post = models.ForeignKey(Post, on_delete=models.CASCADE,related_name='learneds')
    def __str__(self):
        return f'{self.user} Learned from {self.post}' 
    