from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Item, InventoryItem
from .serializers import ItemSerializer, InventoryItemSerializer

class ItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class InventoryItemViewSet(viewsets.ModelViewSet):
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InventoryItem.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        items_data = request.data.get('items', [])
        for item_data in items_data:
            item_id = item_data.get('item_id')
            quantity = item_data.get('quantity')
            if item_id and quantity:
                item = Item.objects.get(pk=item_id)
                inventory_item, created = InventoryItem.objects.get_or_create(user=user, item=item)
                inventory_item.quantity += quantity
                inventory_item.save()
        return Response(status=status.HTTP_201_CREATED)

