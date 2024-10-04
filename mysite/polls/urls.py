from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("polls", views.polls, name="polls"),
    path("choices", views.choices, name="choices"),
    path("vote", views.vote, name="vote"),
]