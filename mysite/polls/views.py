from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.urls import reverse
from .models import Question, Choice
from .forms import QuestionForm, ChoiceFormSet

# Create your views here.
def index(request):
    if request.method == "POST":
        question_form = QuestionForm(request.POST)
        choice_formset = ChoiceFormSet(request.POST)
        if question_form.is_valid() and choice_formset.is_valid():
            question = question_form.save()
            choices = choice_formset.save(commit=False)
            print(len(choices))
            for choice in choices:
                choice.question = question
                choice.save()
            
            return HttpResponseRedirect(reverse("index"))

    else:
        question_form = QuestionForm()
        choice_formset = ChoiceFormSet()

    return render(request, "polls/index.html", {
            "question_form": question_form,
            "choice_formset": choice_formset,
        })
    
    


def questions(request):
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or start + 10)

    questions = Question.objects.all().order_by("-pub_date")[start:end]
    questions_formatted = []

    for q in questions:
        qf = {"id": q.id, "question_text": q.question_text, "pub_date": q.pub_date.isoformat(), "category": q.category}
        questions_formatted.append(qf)
        
    return JsonResponse({
            "questions": questions_formatted
        })