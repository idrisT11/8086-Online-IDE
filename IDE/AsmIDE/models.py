from django.db import models
from django.utils import timezone

# Create your models here.

class Student(models.Model):
    
    first_name = models.CharField(max_length=25, null=False, blank=False,  default="", unique=True)
    family_name = models.CharField(max_length=25, null=False, blank=False, default="", unique=True)

    is_admin = models.BooleanField(default=False)
    email = models.EmailField(max_length=30, blank=False, unique=True, default="")
    test_content = models.TextField(null=True)
    group = models.IntegerField(default=0)

    def __str__(self):

        return ("{} {}".format(self.first_name, self.family_name))


class Tests(models.Model):

    test_id = models.IntegerField(default=0, null=True)
    starting_time = models.DateTimeField(default=timezone.now())
    passwd = models.CharField(max_length=30, null=True, blank=False, default="@add*wshG")
    #duration in minutes 
    duration = models.IntegerField(default=0, null=True)

    #if the test is still going 
    is_active = models.BooleanField(default=False)

    student = models.ForeignKey('Student', on_delete=models.CASCADE, null=True)




    



