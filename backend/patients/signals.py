from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import Client, Enrollment

@receiver(post_save, sender=Client)
def client_post_save(sender, instance, created, **kwargs):
    if created:
        try:
            # Prepare email content
            context = {
                'client': instance,
            }
            html_content = render_to_string('emails/welcome_email.html', context)
            text_content = strip_tags(html_content)
            
            # Send email synchronously
            send_mail(
                subject='Welcome to Health Information System',
                message=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.email],
                html_message=html_content,
                fail_silently=True
            )
        except Exception as e:
            print(f"Error sending welcome email: {str(e)}")

@receiver(post_save, sender=Enrollment)
def enrollment_post_save(sender, instance, created, **kwargs):
    if created:
        try:
            # Prepare email content
            context = {
                'enrollment': instance,
                'client': instance.client,
                'program': instance.program
            }
            html_content = render_to_string('emails/program_enrollment.html', context)
            text_content = strip_tags(html_content)
            
            # Send email synchronously
            send_mail(
                subject=f'Enrollment Confirmation - {instance.program.name}',
                message=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.client.email],
                html_message=html_content,
                fail_silently=True
            )
        except Exception as e:
            print(f"Error sending enrollment email: {str(e)}")