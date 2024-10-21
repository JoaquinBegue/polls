from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.urls import reverse
from django.utils import timezone
from django.db.models import Count, Q
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
    
    if category == "All":
        category = None

    if order == "Most recent":
        order = "-pub_date"
    elif order == "Most voted":
        order = "-votes"
    else:
        order = "trending"
    
    # If requesting treding, get the most voted polls in the last 24 hours.
    if order == "trending":
        time_threshold = timezone.now() - timezone.timedelta(hours=24)
        polls = Poll.objects.filter(
            # Filter by category. If no category given, get all polls by filtering by id (get all polls with an ID greater or equal to 1)
            Q(category=category) if category else Q(id__gte=1),
            # Filter by votes with a date newer than last 24hs.
            # Then, add a temporal 'num_votes' field that stores the amount of votes of each poll.
            # Finally, order the queryset according to num_votes in descendent order.
            votes__date__gte=time_threshold) \
            .annotate(num_votes=Count('votes')) \
            .order_by('-num_votes')[start:end]
    else:
        polls = Poll.objects.filter(Q(category=category) if category else Q(id__gte=1)).order_by(order)[start:end]


    polls_formatted = []
    for p in polls:
        pf = {"id": p.id, "question_text": p.question_text, "pub_date": p.pub_date.isoformat(), "category": p.category, "votes": p.votes.count()}
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
    choice = Choice.objects.get(id=choice_id)
    poll = Poll.objects.get(id=choice.poll.id)
    percentages = {}
    
    vote, created = Vote.objects.get_or_create(user=request.user, poll=poll, choice_obj=choice)
    # If vote found, the user unvoted the choice. Delete it.
    if not created:
        # Unvote choice.
        vote.delete()
        return JsonResponse({"percentages": percentages})
    
    # If created, a new vote was made. So try find any other vote this user
    # made on this poll and delete it.
    try: 
        v = poll.votes.filter(user=request.user).exclude(choice_obj=choice)[0]
        v.delete()
    except ZeroDivisionError:
        ...
    
    # Vote choice.
    choice.votes.add(vote)  

    # Calculate each choice vote percentage.
    total_votes = poll.votes.count()
    print(total_votes)
    for choice in poll.choices.all():
        print(choice.choice_text, choice.votes.count())
        try:
            percentages[choice.id] = round(100 / (total_votes / choice.votes.count()))
        except ZeroDivisionError:
            percentages[choice.id] = 0

    return JsonResponse({"percentages": percentages})