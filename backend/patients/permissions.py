from rest_framework import permissions


class IsDoctor(permissions.BasePermission):
    """
    Custom permission to only allow doctors to access the view.
    In a real application, this would check for specific roles or groups.
    """
    
    def has_permission(self, request, view):
        # For this demo, we'll consider all authenticated users as doctors
        # In a real application, you would check for specific roles or groups
        return request.user and request.user.is_authenticated


class IsClientRegistrar(permissions.BasePermission):
    """
    Custom permission to only allow staff with client registration privileges.
    """
    
    def has_permission(self, request, view):
        # For this demo, we'll consider all authenticated users as having registration privileges
        # In a real application, you would check for specific roles or permissions
        return request.user and request.user.is_authenticated