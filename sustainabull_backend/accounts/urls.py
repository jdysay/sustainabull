from django.urls import path
from . import views

urlpatterns = [
    # Existing auth URLs
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    
    # Add these new URLs
    path('user/', views.get_user_data, name='get_user_data'),
    path('update-gold/', views.update_gold, name='update_gold'),
]