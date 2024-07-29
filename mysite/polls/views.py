from django.shortcuts import render
from django.http import HttpResponse
from .models import Question, Choice

# Create your views here.
def index(request):
    return render(request, "polls/index.html", {
            "questions": Question.objects.all()
        })