from django.contrib import admin
from .models import Villa, ContactMessage

@admin.register(Villa)
class VillaAdmin(admin.ModelAdmin):
    list_display = ('title', 'tipologjia', 'price', 'bedrooms', 'bathrooms', 'is_available')
    list_filter = ('tipologjia', 'is_available', 'has_pool')
    search_fields = ('title', 'description')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'message')
    list_filter = ('created_at',)