from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from shop.views import ItemViewSet, InventoryItemViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'inventory', InventoryItemViewSet, basename='inventory')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/', include(router.urls)),
]
