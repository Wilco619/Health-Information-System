from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .serializers import LoginSerializer, OTPVerificationSerializer
from .models import OTP
from .tasks import send_otp_email


class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        try:
            # Generate OTP
            otp = OTP.generate_otp(user)
            
            # Prepare email content
            context = {
                'user': user,
                'otp_code': otp.otp_code,
                'expire_time': settings.OTP_EXPIRE_TIME,
            }
            html_content = render_to_string('emails/otp_email.html', context)
            text_content = strip_tags(html_content)
            
            # Send email synchronously
            send_mail(
                subject='Your OTP for Health System Login',
                message=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_content,
            )
            
            return Response({
                'message': 'OTP has been sent to your email.',
                'username': user.username
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Error during login: {str(e)}")  # For debugging
            return Response({
                'error': 'Failed to process login. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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