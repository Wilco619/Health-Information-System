# patients/models.py

from django.db import models
from django.contrib.auth.models import User
import uuid


class HealthProgram(models.Model):
    """
    Model representing a health program (e.g., TB, Malaria, HIV, etc.).
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    code = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_programs')
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    class Meta:
        ordering = ['name']


class Client(models.Model):
    """
    Model representing a client/patient in the health system.
    """
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    address = models.TextField()
    national_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    
    # Health information
    blood_type = models.CharField(max_length=5, null=True, blank=True)
    allergies = models.TextField(null=True, blank=True)
    chronic_conditions = models.TextField(null=True, blank=True)
    
    # Timestamps
    registered_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Relationships
    programs = models.ManyToManyField(HealthProgram, through='Enrollment', related_name='clients')
    registered_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='registered_clients')
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    class Meta:
        ordering = ['last_name', 'first_name']
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def active_programs(self):
        return self.enrollments.filter(is_active=True).select_related('program')


class Enrollment(models.Model):
    """
    Model representing a client's enrollment in a health program.
    """
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='enrollments')
    program = models.ForeignKey(HealthProgram, on_delete=models.CASCADE, related_name='enrollments')
    enrollment_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(null=True, blank=True)
    
    # Record keeping
    enrolled_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='program_enrollments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.client} - {self.program}"
    
    class Meta:
        unique_together = ('client', 'program')
        ordering = ['-enrollment_date']