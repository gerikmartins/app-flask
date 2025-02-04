from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from .models import Terapeuta

def login_terapeuta(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None and hasattr(user, 'terapeuta'):
            login(request, user)
            return redirect('dashboard_terapeuta')
        else:
            messages.error(request, 'Email ou senha inválidos')
    
    return render(request, 'login_terapeuta.html')

def cadastro_terapeuta(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        crp = request.POST.get('crp')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        
        if password != confirm_password:
            messages.error(request, 'As senhas não coincidem')
            return render(request, 'cadastro_terapeuta.html')
            
        try:
            user = User.objects.create_user(username=email, email=email, password=password)
            terapeuta = Terapeuta.objects.create(
                user=user,
                nome=nome,
                crp=crp
            )
            messages.success(request, 'Conta criada com sucesso!')
            return redirect('login_terapeuta')
        except:
            messages.error(request, 'Erro ao criar conta')
            
    return render(request, 'cadastro_terapeuta.html')