import datetime
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

CATEGORIES = {
    "Politics": "Politics",
    "Sports": "Sports",
    "Games": "Games",
    "Music": "Music",
    "Fashion": "Fashion",
    "Development & Programming": "Development & Programming",
    "Other": "Other",
}

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published", auto_now_add=True)
    category = models.CharField(max_length=25, choices=CATEGORIES, null=True, blank=True)
    

    def __str__(self):
        return self.question_text
    
    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return f"{self.question} > " + self.choice_text