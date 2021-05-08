from django.contrib import admin
from django.urls import path
from . import views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_page, name='home_page'),
    path('admin_login/', views.admin_login, name="admin_login"),
    path('dashboard/',views.dashboard, name='dashboard'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/tests/<int:test_id>', views.display_tests_student, name="student_tests"),
    
]