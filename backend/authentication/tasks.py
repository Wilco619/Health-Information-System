from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings


@shared_task
def send_otp_email(user_id, otp_code):
    from django.contrib.auth.models import User
    
    try:
        user = User.objects.get(id=user_id)
        
        # Render email template
        context = {
            'user': user,
            'otp_code': otp_code,
            'expire_time': settings.OTP_EXPIRE_TIME,
        }
        html_content = render_to_string('emails/otp_email.html', context)
        text_content = strip_tags(html_content)
        
        # Create email message
        subject = 'Your OTP for Health System Login'
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = user.email
        
        # Send email
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        
        return f"OTP email sent to {user.email}"
    except User.DoesNotExist:
        return "User not found"
    except Exception as e:
        return f"Error sending OTP email: {str(e)}"