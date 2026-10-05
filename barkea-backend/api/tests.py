from django.core.cache import cache
from rest_framework.test import APITestCase

from .models import ContactMessage


class ContactMessageAPITests(APITestCase):
    url = '/api/contacts/'

    def setUp(self):
        cache.clear()  # reset throttling counters between tests

    def test_valid_message_is_created(self):
        payload = {
            'first_name': 'Ana', 'last_name': 'Kola', 'email': 'ana@example.com',
            'phone': '+355690000000', 'country': 'Albania', 'message': 'Hello!',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_missing_email_is_rejected(self):
        payload = {
            'first_name': 'Ana', 'last_name': 'Kola',
            'phone': '+355690000000', 'country': 'Albania', 'message': 'Hello!',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_anonymous_cannot_list_messages(self):
        response = self.client.get(self.url)
        self.assertIn(response.status_code, (401, 403))