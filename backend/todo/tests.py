from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Item
from django.contrib.auth.models import User

class ItemAPITests(APITestCase):
    def setUp(self):
        # Item data for testing
        self.item_data = {
            'name': 'Test Item',
            'description': 'This is a test item',
            'quantity': 10,
        }

        self.item = Item.objects.create(**self.item_data)
        self.valid_url = reverse('item-create')
        self.invalid_url = reverse('item-detail', args=[999])  # Non-existent item

    def test_create_item_success(self):
        response = self.client.post(self.valid_url, self.item_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_item_failure(self):
        invalid_data = {'name': '', 'quantity': 10}
        response = self.client.post(self.valid_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_read_item_success(self):
        response = self.client.get(reverse('item-detail', args=[self.item.id]), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.item.name)

    def test_read_item_failure(self):
        response = self.client.get(self.invalid_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_item_success(self):
        updated_data = {'name': 'Updated Item', 'description': 'Updated description', 'quantity': 20}
        response = self.client.put(reverse('item-detail', args=[self.item.id]), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.item.refresh_from_db()
        self.assertEqual(self.item.name, updated_data['name'])

    def test_update_item_failure(self):
        invalid_data = {'name': '', 'quantity': 20}
        response = self.client.put(reverse('item-detail', args=[self.item.id]), invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_item_success(self):
        response = self.client.delete(reverse('item-detail', args=[self.item.id]), format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Item.objects.filter(id=self.item.id).exists())

    def test_delete_item_failure(self):
        response = self.client.delete(self.invalid_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
