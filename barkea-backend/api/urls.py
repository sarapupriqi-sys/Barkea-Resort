from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VillaViewSet, ContactMessageViewSet

router = DefaultRouter()
router.register(r'villas', VillaViewSet)
router.register(r'contacts', ContactMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
