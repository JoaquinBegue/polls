from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        password2 = request.POST["password2"]
        if password == password2:
            user = User.objects.create_user(username=username, password=password)
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, "The provided credentials do not match.")
            return redirect('register')
    
    return render(request, "users/register.html")


def login_user(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, "The provided passwords do not match.")
            return redirect('login_user')
    
    return render(request, "users/login.html")


def logout_user(request):
    logout(request)
    return redirect('index')