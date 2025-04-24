from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HealthProgramViewSet, ClientViewSet, EnrollmentViewSet, DashboardViewSet

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'programs', HealthProgramViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]