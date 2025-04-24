from django.db import models
from django.contrib.auth.models import User
import random
from django.utils import timezone
from django.conf import settings


class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    @classmethod
    def generate_otp(cls, user):
        # Delete any existing OTPs for this user
        cls.objects.filter(user=user).delete()
        
        # Generate a random 6-digit OTP
        otp_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        # Create new OTP
        otp = cls.objects.create(user=user, otp_code=otp_code)
        return otp

    def is_valid(self):
        # Check if OTP is expired
        expire_time = self.created_at + timezone.timedelta(minutes=settings.OTP_EXPIRE_TIME)
        return not self.is_used and timezone.now() <= expire_time