from django.contrib import admin
from .models import *
from django.contrib.auth.models import User 
from django.db import models 

# Register your models here.
class StudentPanel(admin.ModelAdmin):

    list_display = ('first_name', 'family_name', 'email', 'is_admin')
    search_fields = ('first_name', 'family_name', 'email')

class TestPanel(admin.ModelAdmin):

    list_display = ('test_id', 'starting_time',)

    def display_all_students(modeladmin, request, queryset):
        queryset.values('student_id')

    admin.site.add_action(display_all_students, "Display Students List")


admin.site.register(Student, StudentPanel)
admin.site.register(Tests, TestPanel)
