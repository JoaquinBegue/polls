from random import randint, choice
from django.utils import timezone
from django.db.models import Count
from django.contrib.auth.models import User
from .models import *

def create_users(amount):
    registry = Registry.objects.get_or_create(pk=1)[0]
    user_count = registry.user_count

    # Create users.
    for n in range(amount):
        new_user = User.objects.create_user(username=f"user{n + user_count}", password="12345")
    
    # Update registry.
    registry.user_count += amount
    registry.save()

    print(f"{amount} users created successfully")


def create_polls(amount):
    registry = Registry.objects.get_or_create(pk=1)[0]
    poll_count = registry.poll_count
    admin = User.objects.get(username="admin")

    for n in range(amount):
        # Create poll
        new_poll = Poll(
            question_text = f"Question {n+1 + poll_count}",
            category = POLL_CATEGORIES[choice(list(POLL_CATEGORIES.keys()))],
            author = admin
        )
        new_poll.save()

        # Create choices
        for n2 in range(randint(2, 5)):
            new_choice = Choice(
                poll = new_poll,
                choice_text = f"Choice {n2+1}"
            )
            new_choice.save()

    # Update registry.
    registry.poll_count += amount
    registry.save()

    print(f"{amount} polls created successfully")


def make_votes(amount, polls=None):
    # Get polls objects.
    if polls:
        polls = [Poll.objects.get(pk=pk) for pk in polls[:]]
    # If no polls given, get 10 random polls.
    else:
        polls_amount = Registry.objects.get(pk=1).poll_count
        polls = [Poll.objects.get(pk=randint(1, polls_amount)) for n in range(10)]

    # Make random votes, distributing 10 votes per user.
    total_users = round(amount / 10)
    user_amount = Registry.objects.get(pk=1).user_count
    for user_n in range(total_users):
        # Get random user.
        user = User.objects.get(pk=randint(1, user_amount))
        for n in range(10):
            poll = choice(polls)
            new_vote = Vote(
                poll = poll,
                choice_obj = choice(poll.choices),
                user = user
            )
            new_vote.save()

    # Update registry.
    registry = Registry.objects.get_or_create(pk=1)[0]
    registry.vote_count += amount
    registry.save()

    print(f"{amount} votes maked successfully")
    print(f"Voted polls: {polls}")