from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Client, Enrollment
from .tasks import send_welcome_email, send_enrollment_notification


@receiver(post_save, sender=Client)
def client_post_save(sender, instance, created, **kwargs):
    """
    Signal handler to send welcome email when a new client is registered.
    """
    if created:
        # Send welcome email asynchronously
        send_welcome_email.delay(str(instance.id))


@receiver(post_save, sender=Enrollment)
def enrollment_post_save(sender, instance, created, **kwargs):
    """
    Signal handler to send enrollment notification when a client is enrolled in a program.
    """
    if created:
        # Send enrollment notification asynchronously
        send_enrollment_notification.delay(instance.id)