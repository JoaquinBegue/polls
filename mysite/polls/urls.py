from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("questions", views.questions, name="questions"),
    path("choices", views.choices, name="choices"),
    path("vote", views.vote, name="vote"),
]