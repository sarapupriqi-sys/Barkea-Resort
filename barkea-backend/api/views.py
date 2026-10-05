from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import ContactMessage, Villa
from .serializers import ContactMessageSerializer, VillaSerializer


class VillaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Villa.objects.all()
    serializer_class = VillaSerializer


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        # Anyone may submit a message (POST); only admins can read or delete them.
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]