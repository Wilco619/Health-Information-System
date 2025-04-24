from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings


@shared_task
def send_welcome_email(client_id):
    from .models import Client
    
    try:
        client = Client.objects.get(id=client_id)
        
        # Render email template
        context = {
            'client': client,
        }
        html_content = render_to_string('emails/welcome_email.html', context)
        text_content = strip_tags(html_content)
        
        # Create email message
        subject = 'Welcome to the Health System'
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = client.email
        
        # Send email
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        
        return f"Welcome email sent to {client.email}"
    except Client.DoesNotExist:
        return "Client not found"
    except Exception as e:
        return f"Error sending welcome email: {str(e)}"


@shared_task
def send_enrollment_notification(enrollment_id):
    from .models import Enrollment
    
    try:
        enrollment = Enrollment.objects.select_related('client', 'program').get(id=enrollment_id)
        client = enrollment.client
        program = enrollment.program
        
        # Render email template
        context = {
            'client': client,
            'program': program,
            'enrollment': enrollment,
        }
        html_content = render_to_string('emails/program_enrollment.html', context)
        text_content = strip_tags(html_content)
        
        # Create email message
        subject = f'Enrollment Confirmation: {program.name} Program'
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = client.email
        
        # Send email
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        
        return f"Enrollment notification sent to {client.email}"
    except Enrollment.DoesNotExist:
        return "Enrollment not found"
    except Exception as e:
        return f"Error sending enrollment notification: {str(e)}"