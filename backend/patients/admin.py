from django.contrib import admin
from .models import HealthProgram, Client, Enrollment


@admin.register(HealthProgram)
class HealthProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'description', 'created_at', 'created_by')
    list_filter = ('created_at',)
    search_fields = ('name', 'code', 'description')
    readonly_fields = ('created_at', 'updated_at', 'created_by')


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone_number', 'date_of_birth', 'gender', 'registered_at')
    list_filter = ('gender', 'registered_at')
    search_fields = ('first_name', 'last_name', 'email', 'phone_number', 'national_id')
    readonly_fields = ('registered_at', 'updated_at', 'registered_by')
    fieldsets = (
        (None, {
            'fields': ('first_name', 'last_name', 'date_of_birth', 'gender', 'email', 'phone_number', 'address', 'national_id')
        }),
        ('Health Information', {
            'fields': ('blood_type', 'allergies', 'chronic_conditions')
        }),
        ('System Information', {
            'fields': ('registered_at', 'updated_at', 'registered_by')
        }),
    )
    
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = 'Full Name'


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('client', 'program', 'enrollment_date', 'is_active', 'enrolled_by')
    list_filter = ('is_active', 'enrollment_date', 'program')
    search_fields = ('client__first_name', 'client__last_name', 'program__name')
    readonly_fields = ('enrollment_date', 'created_at', 'updated_at', 'enrolled_by')