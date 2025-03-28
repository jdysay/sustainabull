from rest_framework import serializers
from .models import Item, InventoryItem

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


class InventoryItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = InventoryItem
        fields = ['item', 'quantity']

