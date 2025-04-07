from rest_framework import generics, status
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import User  # Adjust based on your actual model
from django.db.models import F

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    
    def perform_create(self, serializer):
        user = serializer.save()
        # Explicitly set gold to ensure the default is applied
        user.gold = 100  # Default starting gold
        user.save()

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    profile = User.objects.get(user=user)
    
    return Response({
        'id': user.id,
        'username': user.username,
        'gold': profile.gold,
        # Other user data you want to include
    })

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_gold(request):
    """Update the user's gold amount"""
    if 'gold' not in request.data:
        return Response({'error': 'Gold amount is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = request.user
    
    try:
        # Instead of accessing profile, update the user object directly
        # Most likely you're storing gold directly on the user model or using a custom user model
        
        # If gold is stored directly on the User model:
        user.gold = float(request.data['gold'])
        user.save()
        
        # If you're using a UserProfile model with a one-to-one relationship:
        # user.userprofile.gold = float(request.data['gold'])
        # user.userprofile.save()
        
        return Response({
            'success': True,
            'gold': user.gold,
            'username': user.username,
            'id': user.id
        })
    except (ValueError, TypeError):
        return Response({'error': 'Invalid gold amount'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)