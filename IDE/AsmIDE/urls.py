from django.contrib import admin
from django.urls import path
from . import views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_page, name='home_page'),
    path('admin_login/', views.admin_login, name="admin_login"),
    path('dashboard/',views.dashboard, name='dashboard'),
    path('dashboard/create_test', views.create_test, name='create_test'),
    path('dashboard/tests/<int:test_id>', views.display_test_students, name='display_test_students'),
    path('dashboard/alltests', views.display_tests, name='see_all_tests'),
]