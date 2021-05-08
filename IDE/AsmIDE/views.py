from django.shortcuts import render, redirect
from django.http import request, Http404, HttpResponse, HttpResponseRedirect
from .models import * 
from django.utils import timezone 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import *
from django import forms
# Create your views here.

def home_page(request):
        
    submission_form = Submission(request.POST or None)
    context = {'submission_form':submission_form}

    if(submission_form.is_valid()):

        #for an unknown reason it doesn't work
        first_name = submission_form.cleaned_data['first_name']
        family_name = submission_form.cleaned_data['family_name']
        group = submission_form.cleaned_data['group']
        email = submission_form.cleaned_data['email']
        test_id = submission_form.cleaned_data['test_id']
        content = request.POST['content']
        test_password = submission_form.cleaned_data['test_passwd']

        #checking if there is only one running test
        tests = Tests.objects.all().filter(is_active=True)

        if (len(tests) != 1):

            return redirect('home_page')
        
        if (test_id != tests[0].test_id or test_password != tests[0].passwd):

            
            return redirect('home_page')

        else:

            #real test ID in database
            test_id = tests[0].id 
            running_test = Tests.objects.get(id=test_id)
            
            #time limit not reached
            if (running_test.is_active):

                running_test.student_set.create(

                    first_name = first_name, 
                    family_name = family_name, 
                    group = group, 
                    test_content = content,
                    email = email,
                )

                running_test.save()

            return redirect('home_page')
    return render(request, 'home.html', context)


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

        
    return render(request, 'adminlogin.html', locals())

@login_required
def dashboard(request):

    create_test_form = CreateTest(request.POST or None)
    
    if (create_test_form.is_valid()):

        test_id = create_test_form.cleaned_data['test_id']
        test_duration = create_test_form.cleaned_data['test_duration']
        test_passwd = create_test_form.cleaned_data['test_passwd']

        #existing_tests = Tests.objects.all()

        new_test = Tests(

            test_id = test_id, 
            duration = test_duration, 
            passwd = test_passwd,
            is_active = True,
        )

        new_test.save()

    #just testing for the moment
    all_tests = Tests.objects.all().filter(is_active=False)


    return render(request, 'index.html', locals())

@login_required
def logout_view(request):

    if (request.method == "POST"):

        logout(request)
        messages.success(request, 'Logged out successfully')

        return redirect('home_page')


@login_required
def display_tests_student(request, test_id):

    """ A view to display the students who passed a test given its test_id """

    test = Tests.objects.get(test_id=test_id)
    students = test.student_set.all()

    return render(request, 'studenttest.html', locals())

