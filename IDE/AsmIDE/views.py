from django.shortcuts import render, redirect
from django.http import request, Http404, HttpResponse, HttpResponseRedirect
from .models import * 
from django.utils import timezone 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import *
# Create your views here.

def home_page(request):
        
    submission_form = Submission(request.POST or None)

    if(submission_form.is_valid()):

        first_name = submission_form.cleaned_data['first_name']
        family_name = submission_form.cleaned_data['family_name']
        group = submission_form.cleaned_data['group']

    return render(request, 'home.html', locals())



def admin_login(request):
    
    if (request.method == "POST"):

        username = request.POST['admin-name']
        password = request.POST['admin-pass']

        teacher = authenticate(username=username, password=password)

        if (teacher):

            login(request, teacher)
            next_url = request.GET.get('next')

            #redirect to teacher dashboard
            if (next_url):
                return redirect(next_url)

        else:
            messages.error(request, 'Invalid Credentials!')

        
    return render(request, 'adminlogin.html')

@login_required
def dashboard(request):

    create_test_form = CreateTest(request.POST or None)
    stop_test_form = DeleteTest(request.POST or None)
    
    if (create_test_form.is_valid()):

        test_id = create_test_form.cleaned_data['test_id']
        test_duration = create_test_form.cleaned_data['test_duration']
        test_passwd = create_test_form.cleaned_data['test_passwd']

        new_test = Tests(

            test_id = test_id, 
            duration = test_duration, 
            passwd = test_passwd,
            is_active = True,
        )

        new_test.save()


    return render(request, 'adminhome.html', locals())

@login_required
def logout_view(request):

    if (request.method == "POST"):

        logout(request)
        messages.success(request, 'Logged out successfully')

        return redirect('home_page')


