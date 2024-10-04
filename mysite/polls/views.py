from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.urls import reverse
from .models import Poll, Choice, Vote
from .forms import PollForm, ChoiceFormSet

# Create your views here.
def index(request):
    """Renders the main page and process the poll form data."""

    if request.method == "POST":
        poll_form = PollForm(request.POST)
        choice_formset = ChoiceFormSet(request.POST)
        if poll_form.is_valid() and choice_formset.is_valid():
            poll = poll_form.save(commit=False)
            poll.author = request.user
            poll.save()
            choices = choice_formset.save(commit=False)
            for choice in choices:
                choice.poll = poll
                choice.save()
            
            return HttpResponseRedirect(reverse("index"))

    else:
        poll_form = PollForm()
        choice_formset = ChoiceFormSet()

    return render(request, "polls/index.html", {
            "poll_form": poll_form,
            "choice_formset": choice_formset,
        })
    

def polls(request):
    """Returns the requested set of polls."""

    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or start + 10)
    category = request.GET.get("category")
    order = request.GET.get("order")

    if order == "Most recent":
        order = "-pub_date"
    elif order == "Most voted":
        order = "votes"
    else:
        order = "trending"
    print(order)

    if category == "All":
        polls = Poll.objects.all().order_by(order)[start:end]
    else:
        polls = Poll.objects.filter(category=category).order_by(order)[start:end]
    
    polls_formatted = []
    for p in polls:
        pf = {"id": p.id, "question_text": p.question_text, "pub_date": p.pub_date.isoformat(), "category": p.category}
        polls_formatted.append(pf)
        
    return JsonResponse({
            "polls": polls_formatted
        })


def choices(request):
    """Returns the choices of a requested poll."""

    poll_id = int(request.GET.get("poll_id"))

    poll = Poll.objects.get(id=poll_id)
    choices = Choice.objects.filter(poll=poll)
    choices_formatted = []

    for c in choices:
        cf = {"id": c.id, "choice_text": c.choice_text, "votes": c.votes.count()}
        if request.user in c.votes.all():
            cf["voted"] = True

        choices_formatted.append(cf)
        
    return JsonResponse({
            "choices": choices_formatted
        })


def vote(request):
    """Handles the voting system."""

    choice_id = request.GET.get("choice_id")
    behavior = request.GET.get("behavior")
    choice = Choice.objects.get(id=choice_id)
    
    if behavior == "vote":
        # Unvote other choices.
        poll = Poll.objects.get(id=choice.Poll.id)
        try:
            vote = Vote.objects.get(poll=poll, user=request.user)
            for c in Poll.choices.all():
                c.votes.remove(vote)
        except:
            print("ERRORRRRRRRRRRR")
            
        # Vote choice.
        vote = Vote(poll=poll, choice_obj=choice, user=request.user)
        choice.votes.add(vote)

    else:
        print("unvote")
        # Unvote choice.
        vote = Vote.objects.get(choice_obj=choice, user=request.user)
        choice.votes.remove(vote)

    return JsonResponse({
            "votes": choice.votes.count()
        })