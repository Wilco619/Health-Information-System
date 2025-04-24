# patients/serializers.py

from rest_framework import serializers
from .models import HealthProgram, Client, Enrollment


class HealthProgramSerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = HealthProgram
        fields = ['id', 'name', 'description', 'code', 'created_at', 'updated_at', 
                  'created_by', 'created_by_username']
        read_only_fields = ['created_at', 'updated_at', 'created_by']
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['created_by'] = user
        return super().create(validated_data)


class EnrollmentSerializer(serializers.ModelSerializer):
    program_name = serializers.ReadOnlyField(source='program.name')
    program_code = serializers.ReadOnlyField(source='program.code')
    enrolled_by_username = serializers.ReadOnlyField(source='enrolled_by.username')
    
    class Meta:
        model = Enrollment
        fields = ['id', 'program', 'program_name', 'program_code', 'enrollment_date', 
                 'is_active', 'notes', 'enrolled_by', 'enrolled_by_username', 
                 'created_at', 'updated_at']
        read_only_fields = ['enrollment_date', 'created_at', 'updated_at', 'enrolled_by']


class ClientSerializer(serializers.ModelSerializer):
    registered_by_username = serializers.ReadOnlyField(source='registered_by.username')
    
    class Meta:
        model = Client
        fields = ['id', 'first_name', 'last_name', 'full_name', 'date_of_birth', 
                 'gender', 'email', 'phone_number', 'address', 'national_id',
                 'blood_type', 'allergies', 'chronic_conditions', 'registered_at',
                 'updated_at', 'registered_by', 'registered_by_username']
        read_only_fields = ['id', 'registered_at', 'updated_at', 'registered_by', 'full_name']
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['registered_by'] = user
        return super().create(validated_data)


class ClientDetailSerializer(ClientSerializer):
    enrollments = EnrollmentSerializer(many=True, read_only=True)
    
    class Meta(ClientSerializer.Meta):
        fields = ClientSerializer.Meta.fields + ['enrollments']


class ClientEnrollmentSerializer(serializers.Serializer):
    client_id = serializers.UUIDField()
    program_id = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_client_id(self, value):
        try:
            Client.objects.get(id=value)
            return value
        except Client.DoesNotExist:
            raise serializers.ValidationError("Client not found.")
    
    def validate_program_id(self, value):
        try:
            HealthProgram.objects.get(id=value)
            return value
        except HealthProgram.DoesNotExist:
            raise serializers.ValidationError("Health program not found.")
    
    def validate(self, data):
        client_id = data.get('client_id')
        program_id = data.get('program_id')
        
        # Check if client is already enrolled in this program
        if Enrollment.objects.filter(client_id=client_id, program_id=program_id).exists():
            raise serializers.ValidationError("Client is already enrolled in this program.")
        
        return data
    
    def create(self, validated_data):
        user = self.context['request'].user
        client = Client.objects.get(id=validated_data['client_id'])
        program = HealthProgram.objects.get(id=validated_data['program_id'])
        notes = validated_data.get('notes', '')
        
        enrollment = Enrollment.objects.create(
            client=client,
            program=program,
            notes=notes,
            enrolled_by=user
        )
        
        return enrollment


class ClientSearchSerializer(serializers.Serializer):
    query = serializers.CharField(required=False, allow_blank=True)
    program_id = serializers.IntegerField(required=False, allow_null=True)