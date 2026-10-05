from rest_framework import serializers

from .models import ContactMessage, Villa


class VillaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Villa
        fields = '__all__'


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'first_name', 'last_name', 'email',
            'phone', 'country', 'message', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {'message': {'max_length': 2000}}