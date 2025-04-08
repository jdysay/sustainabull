from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/shop/', include('shop.urls')),
    path('api/routes/', include('routes.urls')),  # Add this line
]
