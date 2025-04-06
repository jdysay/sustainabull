from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ItemViewSet, InventoryItemViewSet, CowViewSet,
    TransportationLogViewSet, add_to_inventory,
    feed_cow, travel, test_auth
)

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'inventory', InventoryItemViewSet, basename='inventory')
router.register(r'cows', CowViewSet, basename='cow')
router.register(r'transportation-logs', TransportationLogViewSet, basename='transportation-logs')

urlpatterns = [
    path('', include(router.urls)),
    path('add-to-inventory/', add_to_inventory, name='add_to_inventory'),
    path('feed-cow/', feed_cow, name='feed_cow'),
    path('travel/', travel, name='travel'),
    path('test-auth/', test_auth, name='test_auth'),
]
