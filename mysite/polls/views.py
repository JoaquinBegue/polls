from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Question, Choice
from .utils import DateTimeAwareEncoder
import json

# Create your views here.
def index(request):
    return render(request, "polls/index.html")


def questions(request):
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or start + 10)

    questions = Question.objects.all().order_by("-pub_date")[start:end]
    questions_formatted = []

    for q in questions:
        qf = {"id": q.id, "question_text": q.question_text, "pub_date": q.pub_date.isoformat(), "category": q.category}
        questions_formatted.append(qf)

    print(questions_formatted)
        
    return JsonResponse({
            "questions": questions_formatted
        })