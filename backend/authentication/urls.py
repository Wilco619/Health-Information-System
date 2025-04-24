from django.urls import path
from .views import LoginAPIView, OTPVerificationAPIView

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('verify-otp/', OTPVerificationAPIView.as_view(), name='verify-otp'),
]