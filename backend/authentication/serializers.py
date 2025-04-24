from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import OTP


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'), username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid username or password.')
        else:
            raise serializers.ValidationError('Must include "username" and "password".')

        data['user'] = user
        return data


class OTPVerificationSerializer(serializers.Serializer):
    username = serializers.CharField()
    otp_code = serializers.CharField(max_length=6)

    def validate(self, data):
        username = data.get('username')
        otp_code = data.get('otp_code')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError('User not found.')

        try:
            otp = OTP.objects.get(user=user, otp_code=otp_code, is_used=False)
            if not otp.is_valid():
                raise serializers.ValidationError('OTP has expired.')
        except OTP.DoesNotExist:
            raise serializers.ValidationError('Invalid OTP.')

        data['user'] = user
        data['otp'] = otp
        return data