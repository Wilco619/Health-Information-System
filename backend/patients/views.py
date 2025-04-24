from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import HealthProgram, Client, Enrollment
from .serializers import (
    HealthProgramSerializer, 
    ClientSerializer, 
    ClientDetailSerializer, 
    EnrollmentSerializer, 
    ClientEnrollmentSerializer,
    ClientSearchSerializer
)
from .permissions import IsDoctor, IsClientRegistrar


class HealthProgramViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing health programs.
    """
    queryset = HealthProgram.objects.all()
    serializer_class = HealthProgramSerializer
    permission_classes = [IsAuthenticated, IsDoctor]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']


class ClientViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing clients/patients.
    """
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, IsClientRegistrar]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone_number', 'national_id']
    ordering_fields = ['last_name', 'first_name', 'registered_at']
    ordering = ['last_name', 'first_name']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClientDetailSerializer
        return super().get_serializer_class()
    
    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        """
        Retrieve client profile with detailed information including enrollments.
        """
        client = self.get_object()
        serializer = ClientDetailSerializer(client)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def search(self, request):
        """
        Search for clients based on various parameters.
        """
        serializer = ClientSearchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        query = serializer.validated_data.get('query', '')
        program_id = serializer.validated_data.get('program_id')
        
        clients = Client.objects.all()
        
        # Filter by search query
        if query:
            clients = clients.filter(
                Q(first_name__icontains=query) | 
                Q(last_name__icontains=query) | 
                Q(email__icontains=query) | 
                Q(phone_number__icontains=query) | 
                Q(national_id__icontains=query)
            )
        
        # Filter by program
        if program_id:
            clients = clients.filter(enrollments__program_id=program_id, enrollments__is_active=True).distinct()
        
        page = self.paginate_queryset(clients)
        if page is not None:
            serializer = ClientSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        """
        Enroll a client in a health program.
        """
        client = self.get_object()
        
        # Add the client_id to the request data
        data = request.data.copy()
        data['client_id'] = str(client.id)
        
        serializer = ClientEnrollmentSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        enrollment = serializer.save()
        
        return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)


class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing program enrollments.
    """
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated, IsDoctor]
    
    def perform_create(self, serializer):
        serializer.save(enrolled_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """
        Toggle the active status of an enrollment.
        """
        enrollment = self.get_object()
        enrollment.is_active = not enrollment.is_active
        enrollment.save()
        
        serializer = self.get_serializer(enrollment)
        return Response(serializer.data)