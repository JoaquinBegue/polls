from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Question, Choice
from .utils import DateTimeAwareEncoder

# Create your views here.
def index(request):
    return render(request, "polls/index.html")


def questions(request):
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or start + 10)

    questions = Question.objects.all().order_by("-pub_date")[start:end]

    questions_formatted = []

    for q in questions:
        fquestion = {"id": q.id, "question_text": q.question_text, "category": q.category}
        fquestion["pub_date"] = {"year": q.pub_date.year, "month": q.pub_date.month,
                                    "day": q.pub_date.day, "hour": q.pub_date.hour,
                                    "minute": q.pub_date.minute, "second": q.pub_date.second}
        questions_formatted.append(fquestion)
        
    return JsonResponse({
            "questions": questions_formatted
        })