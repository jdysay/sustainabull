from django.urls import path
from . import views

urlpatterns = [
    path('get-route/', views.get_route, name='get-route'),
    path('apply-rewards/', views.apply_trip_rewards, name='apply-rewards'),
]
