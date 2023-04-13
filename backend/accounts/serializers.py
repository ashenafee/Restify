from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, ValidationError

from .models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email',
                  'phone_number', 'avatar']


class UserSignupSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email',
                  'phone_number', 'avatar', 'password', 'password_confirm']

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        user = User.objects.create_user(**validated_data)
        return user

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise ValidationError('Passwords do not match')

        return data

    def validate_password(self, value):
        # Use Django's built-in password validation
        validate_password(value)
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError('Email already exists')

        # Use Django's built-in email validator
        try:
            validate_email(value)
        except ValidationError:
            raise ValidationError('Invalid email address')

        return value

    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise ValidationError('Phone number already exists')

        if not value.isdigit():
            raise ValidationError('Phone number must be digits')

        return value

    def is_valid(self, raise_exception=False):
        return super().is_valid()


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=100, write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)

            if user:
                data['user'] = user
            else:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Username and password are required')

        return data


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email',
                  'phone_number', 'avatar']

    def update(self, user, validated_data):
        # Update the user's fields based on the validated data
        user.username = validated_data.get('username', user.username)
        user.first_name = validated_data.get('first_name', user.first_name)
        user.last_name = validated_data.get('last_name', user.last_name)
        user.email = validated_data.get('email', user.email)
        user.phone_number = validated_data.get('phone_number',
                                               user.phone_number)
        user.avatar = validated_data.get('avatar', user.avatar)
        user.save()

        return user

    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise ValidationError('Phone number already exists')

        if not value.isdigit():
            raise ValidationError('Phone number must be digits')

        return value

