from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import LoginSerializer, OTPVerificationSerializer
from .models import OTP
from .tasks import send_otp_email


class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Generate OTP
        otp = OTP.generate_otp(user)
        
        # Send OTP via email asynchronously
        send_otp_email.delay(user.id, otp.otp_code)
        
        return Response({
            'message': 'OTP has been sent to your email.',
            'username': user.username
        }, status=status.HTTP_200_OK)


class OTPVerificationAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        otp = serializer.validated_data['otp']
        
        # Mark OTP as used
        otp.is_used = True
        otp.save()
        
        # Create or get token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'email': user.email
        }, status=status.HTTP_200_OK)