from django.contrib import admin
from django.urls import path, include
from .routes.views import get_route


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/routes/get-route/', get_route, name='get-route'),  # Fix here
]
