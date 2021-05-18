from django.shortcuts import render, redirect
from django.http import request, Http404, HttpResponse, HttpResponseRedirect
from .models import * 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django import forms
from datetime import datetime
# Create your views here.

def home_page(request):
        
        wrong_password = False 
        wrong_test_id = False 

        if (request.method == "POST"):

            first_name = request.POST['first-name']
            family_name = request.POST['family-name']
            email = request.POST['email']
            group = request.POST['group']
            test_id = request.POST['test-id']
            test_password = request.POST['test-passwd']
            content = request.POST['content']
            
        #checking if there is only one running test
            tests = Tests.objects.all().filter(is_active=True)

            if (len(tests) != 1):
                
                return redirect('home_page')
       
            elif (int(test_id) != tests[0].test_id):

                wrong_test_id = True

            elif(test_password != tests[0].passwd):

                wrong_password = True 


            else:

                #real test ID in database
                test_id = tests[0].id 
                running_test = Tests.objects.get(id=test_id)
                test_starting_time = running_test.starting_time 
                submission_time = datetime.now()
                delta = submission_time - test_starting_time


                running_test.student_set.create(
                 
                     first_name = first_name, 
                     family_name = family_name, 
                     group = group, 
                     test_content = content,
                     email = email,
                     time_spent = (delta.seconds) // 60
                     )

                running_test.save()

                return redirect('home_page')

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

        
    return render(request, 'adminlogin.html', locals())

@login_required
def dashboard(request):

    
    if (request.method == "POST"):

        logout(request)
        messages.success(request, 'Logged out successfully')

        return redirect('home_page')

    return render(request, 'index.html', locals())


@login_required 
def create_test(request):

    if (request.method == "POST"):

        test_id = request.POST['test-id']
        duration = request.POST['test-duration']
        passwd = request.POST['test-passwd']

        #check if there is not another test with the same id
        found = False 
        all_tests = Tests.objects.all()

        for test in all_tests:

            if (test.test_id == int(test_id)):

                found = True 
                break 

        if (not found):

            new_test = Tests(

                test_id=test_id, 
                duration=duration, 
                passwd=passwd, 
                is_active=True,
                starting_time = datetime.now(),
                )
        
            new_test.save()

            return redirect('dashboard')

    return render(request, 'crtest.html', locals())

@login_required
def display_tests(request):

    """ A view to display all the tests passed so far"""

    tests = Tests.objects.all()

    return render(request, 'alltests.html', locals())


@login_required 
def display_students(request, test_id):

    """ A view to dispaly the students who submitted a test given it test_id"""

    test = Tests.objects.get(id=test_id)

    students = test.student_set.all()

    return render(request, 'testsstudent.html', locals())


@login_required 
def display_student_submission(request, student_id):

    """ A view to display the submission of a given student """

    pass 