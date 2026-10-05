"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.views.decorators.clickjacking import xframe_options_sameorigin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('faq/', TemplateView.as_view(template_name='faq.html'), name='faq'),
    path('legal/', TemplateView.as_view(template_name='legal.html'), name='legal'),
    path('privacy/', TemplateView.as_view(template_name='privacy.html'), name='privacy'),
    path('masterplan-3d/', xframe_options_sameorigin(TemplateView.as_view(template_name='masterplan-3d.html')), name='masterplan_3d'),
    path('villas/', TemplateView.as_view(template_name='villas.html'), name='villas'),
    path('gallery/', TemplateView.as_view(template_name='gallery.html'), name='gallery'),
    path('contact/', TemplateView.as_view(template_name='contact.html'), name='contact'),
    path('design/', TemplateView.as_view(template_name='design.html'), name='design'),
]