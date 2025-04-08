from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'non_field_errors': ['Unable to log in with provided credentials.']}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password, email=email)
        user.gold = 100  # Starting gold for new users
        user.save()
        
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    """Get the current user's data"""
    user = request.user
    
    # The error is here - we don't need to query for the user when we already have it
    # Fix: Just return the user data without querying
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'gold': getattr(user, 'gold', 0)  # Safe access to gold attribute
    })

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_gold(request):
    """Update user's gold amount"""
    try:
        new_gold = request.data.get('gold')
        if new_gold is None:
            return Response({'error': 'Gold amount is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user.gold = new_gold
        user.save()
        
        return Response({
            'success': True,
            'gold': user.gold
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)