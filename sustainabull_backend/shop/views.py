from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, action
from django.db import transaction
from .models import Item, InventoryItem, Cow, TransportationLog, TransportationType
from .serializers import (
    ItemSerializer, InventoryItemSerializer, CowSerializer,
    TransportationLogSerializer, TravelRequestSerializer
)

class ItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class InventoryItemViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return InventoryItem.objects.filter(user=self.request.user)

class CowViewSet(viewsets.ModelViewSet):
    serializer_class = CowSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Cow.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Ensure user can only create a cow for themselves
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_cow(self, request):
        """Get the current user's cow or return 404 if none exists"""
        try:
            cow = Cow.objects.get(user=request.user)
            serializer = self.get_serializer(cow)
            return Response(serializer.data)
        except Cow.DoesNotExist:
            return Response(
                {"detail": "You don't have a cow yet. Create one first."},
                status=status.HTTP_404_NOT_FOUND
            )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_inventory(request):
    """Add an item to the user's inventory"""
    try:
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))
        
        if not item_id:
            return Response({'error': 'Item ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the item
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Calculate total cost
        total_cost = item.price * quantity
        
        # Get user with current gold amount
        user = request.user
        
        # Log for debugging
        print(f"User {user.username} gold: {user.gold}, Item cost: {total_cost}")
        
        # Check if user has enough gold
        if user.gold < total_cost:
            return Response({
                'error': f'Not enough gold. You have {user.gold} but need {total_cost}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Deduct gold
        user.gold -= total_cost
        user.save()
        
        # Add to inventory or update existing entry
        inventory_item, created = InventoryItem.objects.get_or_create(
            user=user,
            item=item,
            defaults={'quantity': 0}
        )
        
        # Update quantity
        inventory_item.quantity += quantity
        inventory_item.save()
        
        return Response({
            'success': True,
            'message': f'Added {quantity} {item.name} to inventory',
            'gold_remaining': user.gold,
            'inventory_item': {
                'id': inventory_item.id,
                'item_id': item.id,
                'name': item.name,
                'quantity': inventory_item.quantity
            }
        })
    except Exception as e:
        print(f"Error in add_to_inventory: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def feed_cow(request):
    """Feed the cow with an item from the user's inventory"""
    try:
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))
        
        if not item_id:
            return Response({'error': 'Item ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Ensure quantity is positive
        if quantity <= 0:
            return Response({'error': 'Quantity must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user has a cow
        try:
            cow = Cow.objects.get(user=request.user)
        except Cow.DoesNotExist:
            return Response(
                {'error': 'You need to create a cow first'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if item exists in inventory with sufficient quantity
        try:
            inventory_item = InventoryItem.objects.get(user=request.user, item_id=item_id)
            if inventory_item.quantity < quantity:
                return Response(
                    {'error': f'Not enough items. You have {inventory_item.quantity} but tried to use {quantity}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except InventoryItem.DoesNotExist:
            return Response(
                {'error': 'You do not have this item in your inventory'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Perform the feeding
        item = inventory_item.item
        feed_result = cow.feed(item, quantity)
        
        # Update inventory
        inventory_item.quantity -= quantity
        inventory_item.save()
        
        # Return updated cow and inventory information
        cow_serializer = CowSerializer(cow)
        
        return Response({
            'success': True,
            'message': f'Successfully fed {cow.cow_name} with {quantity} {item.name}',
            'feed_result': feed_result,
            'cow': cow_serializer.data,
            'inventory_item': {
                'id': inventory_item.id,
                'item_id': item.id,
                'name': item.name,
                'remaining_quantity': inventory_item.quantity
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_auth(request):
    """Simple endpoint to test if authentication is working"""
    return Response({
        'success': True,
        'message': 'Authentication is working',
        'user_id': request.user.id,
        'username': request.user.username
    })

class TransportationLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransportationLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return TransportationLog.objects.filter(cow__user=self.request.user).order_by('-created_at')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def travel(request):
    """Record a travel activity and update cow stats"""
    serializer = TravelRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get user's cow
        cow = Cow.objects.get(user=request.user)
        
        # Process travel
        distance = serializer.validated_data['distance_meters']
        transport_type = serializer.validated_data['transport_type']
        
        # Call the travel method to update stats
        result = cow.travel(distance, transport_type)
        
        # Create log entry
        log = TransportationLog.objects.create(
            cow=cow,
            transport_type=transport_type,
            distance_meters=distance,
            xp_gained=result['xp_gained'],
            gold_gained=result['gold_gained']
        )
        
        # Return updated cow data and travel results
        cow_serializer = CowSerializer(cow)
        log_serializer = TransportationLogSerializer(log)
        
        return Response({
            'cow': cow_serializer.data,
            'travel_result': result,
            'log': log_serializer.data
        })
        
    except Cow.DoesNotExist:
        return Response(
            {'error': 'You need to create a cow first'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

