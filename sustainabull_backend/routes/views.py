import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from shop.models import Item, InventoryItem, TransportationType, Cow

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_trip_rewards(request):
    """Apply rewards from completing a trip"""
    try:
        data = request.data
        total_distance = data.get('totalDistance')
        selected_mode = data.get('selectedMode', 'Walk')
        user = request.user
        
        if not total_distance:
            return Response({
                'error': 'Total distance is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate rewards based on transport mode
        if selected_mode == "Drive":
            xp = round((total_distance * 0.1) / 10) if total_distance else 0
            coins = round(total_distance * 0.1)
            food_quantity = 10
            food_name = "corn chunks"
        else:
            xp = round((total_distance * 1) / 10) if total_distance else 0
            coins = round(total_distance * 1)
            food_quantity = 20
            food_name = "corn chunks"
        
        # Add coins to user's account
        user.gold += coins
        user.save()
        
        # Add food to inventory
        try:
            # Find corn chunks item
            corn_item = Item.objects.filter(name__icontains='corn').first()
            if corn_item:
                # Add to inventory
                inventory_item, created = InventoryItem.objects.get_or_create(
                    user=user,
                    item=corn_item,
                    defaults={'quantity': 0}
                )
                inventory_item.quantity += food_quantity
                inventory_item.save()
        except Exception as e:
            print(f"Error adding food to inventory: {e}")
        
        # Apply XP and travel stats to cow if user has one
        try:
            cow = Cow.objects.get(user=user)
            
            # Map transport mode to TransportationType
            transport_type_map = {
                'Walk': TransportationType.WALK,
                'Bike': TransportationType.BIKE,
                'Transit': TransportationType.TRANSIT,
                'Drive': TransportationType.VEHICLE,
                'Drive (electric vehicle)': TransportationType.VEHICLE
            }
            
            transport_type = transport_type_map.get(selected_mode, TransportationType.WALK)
            
            # Update cow stats with travel
            result = cow.travel(int(total_distance), transport_type)
            
            return Response({
                'success': True,
                'rewards': {
                    'xp': xp,
                    'coins': coins,
                    'food': f"{food_quantity} {food_name}"
                },
                'user': {
                    'gold': user.gold
                },
                'cow': {
                    'name': cow.cow_name,
                    'level': cow.cow_level,
                    'hunger': cow.hunger,
                    'mood': cow.mood
                }
            })
            
        except Cow.DoesNotExist:
            # If no cow exists, just return the reward data
            return Response({
                'success': True,
                'rewards': {
                    'xp': xp,
                    'coins': coins,
                    'food': f"{food_quantity} {food_name}"
                },
                'user': {
                    'gold': user.gold
                },
                'message': 'Rewards applied but no cow found to receive XP'
            })
            
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_route(request):
    """Get a route between two points using the OSRM API"""
    try:
        # Get parameters from query string
        start_lat = request.GET.get('start_lat')
        start_lng = request.GET.get('start_lng')
        end_lat = request.GET.get('end_lat')
        end_lng = request.GET.get('end_lng')
        
        # Validate parameters
        if not all([start_lat, start_lng, end_lat, end_lng]):
            return Response(
                {"error": "Missing required parameters: start_lat, start_lng, end_lat, end_lng"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Use OSRM public API to get the route
        osrm_url = f"http://router.project-osrm.org/route/v1/driving/{start_lng},{start_lat};{end_lng},{end_lat}"
        osrm_params = {
            'overview': 'full',
            'geometries': 'polyline',
            'steps': 'false'
        }
        
        response = requests.get(osrm_url, params=osrm_params)
        
        if response.status_code != 200:
            return Response(
                {"error": f"OSRM API returned status code {response.status_code}"},
                status=status.HTTP_502_BAD_GATEWAY
            )
            
        data = response.json()
        
        if data.get('code') != 'Ok':
            return Response(
                {"error": f"OSRM API error: {data.get('message', 'Unknown error')}"},
                status=status.HTTP_502_BAD_GATEWAY
            )
            
        # Return the routes data directly
        return Response(data)
        
    except Exception as e:
        return Response(
            {"error": f"Server error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )