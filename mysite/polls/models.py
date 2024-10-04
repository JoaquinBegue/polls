import datetime
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

POLL_CATEGORIES = {
    "Politics": "Politics",
    "Sports": "Sports",
    "Games": "Games",
    "Music": "Music",
    "Fashion": "Fashion",
    "Development & Programming": "Development & Programming",
    "Other": "Other",
}

class Poll(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published", auto_now_add=True)
    category = models.CharField(max_length=25, choices=POLL_CATEGORIES, null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="polls")
    

    def __str__(self):
        return self.question_text
    
    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)


class Choice(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="choices", null=True)
    choice_text = models.CharField(max_length=200)
    votes = models.ManyToManyField("Vote", blank=True)

    def __str__(self):
        return f"{self.poll} > " + self.choice_text
    

class Vote(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="votes")
    choice_obj = models.ForeignKey(Choice, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="votes")
    date = models.DateTimeField(auto_now_add=True)