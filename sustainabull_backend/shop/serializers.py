from rest_framework import serializers
from .models import Item, InventoryItem, Cow, TransportationLog, TransportationType

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'price', 'image']

class InventoryItemSerializer(serializers.ModelSerializer):
    item_details = serializers.SerializerMethodField()
    
    class Meta:
        model = InventoryItem
        fields = ['id', 'user', 'item', 'quantity', 'item_details']
        read_only_fields = ['user']
    
    def get_item_details(self, obj):
        return {
            'id': obj.item.id,
            'name': obj.item.name,
            'description': obj.item.description,
            'price': obj.item.price,
            'image': obj.item.image
        }

class CowSerializer(serializers.ModelSerializer):
    next_level_xp = serializers.SerializerMethodField()
    
    class Meta:
        model = Cow
        fields = [
            'id', 'cow_name', 'cow_level', 'experience_points', 'next_level_xp',
            'mood', 'hunger', 'co2_emissions', 'exercise',
            'total_distance_traveled', 'created_at', 'last_updated'
        ]
        read_only_fields = ['id', 'created_at', 'last_updated', 'next_level_xp']
    
    def get_next_level_xp(self, obj):
        """Return the XP needed for the next level"""
        if obj.cow_level >= 10:  # Max level
            return None
        return obj.XP_THRESHOLDS[obj.cow_level]

class TransportationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportationLog
        fields = ['id', 'cow', 'transport_type', 'distance_meters', 'xp_gained', 'gold_gained', 'created_at']
        read_only_fields = ['id', 'created_at']

class TravelRequestSerializer(serializers.Serializer):
    distance_meters = serializers.IntegerField(min_value=1)
    transport_type = serializers.ChoiceField(choices=TransportationType.choices)

