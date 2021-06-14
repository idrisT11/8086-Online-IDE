from django.contrib import admin
from django.urls import path
from . import views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.logo_page, name='logo_page'),
    path('emulator/', views.home_page, name='home_page'),
    path('send_test/', views.send_test_page, name='send_test_page'),
    path('admin_login/', views.admin_login, name="admin_login"),
    path('dashboard/',views.dashboard, name='dashboard'),
    path('dashboard/create_test', views.create_test, name='create_test'),
    path('dashboard/alltests', views.display_tests, name='see_all_tests'),
    path('dashboard/live', views.display_live, name='see_live'),
    path('dashboard/tests/<int:test_id>', views.display_students, name='display_students'),
    path('dashboard/students/<int:student_id>', views.display_student_submission, name="view_submission"),
]