from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password', 'password_confirmation')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
        username = serializers.CharField()
        password = serializers.CharField(write_only=True)

        def validate(self, data):
            user = authenticate(**data)
            if user and user.is_active:
                return user
            raise serializers.ValidationError("Incorrect Credentials")