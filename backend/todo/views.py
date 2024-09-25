from rest_framework import viewsets
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import Item
from django_redis import get_redis_connection
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger('inventory')

class ItemListView(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        items = self.get_queryset()
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ItemCreateView(generics.CreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if Item.objects.filter(name=self.request.data.get('name')).exists():
            logger.warning("Item already exists")
            raise serializers.ValidationError({"detail": "Item already exist."})
        serializer.save()

class ItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        conn = get_redis_connection("default")
        item_id = self.kwargs['pk']
        cached_item = conn.get(item_id)

        if cached_item:
            logger.info("Cache hit for item %s", item_id)
            return Item.objects.get(pk=cached_item)
        else:
            item = super().get_object()
            conn.set(item_id, item.id)
            logger.info("Cache miss for item %s", item_id)
            return item

    def update(self, request, *args, **kwargs):
        """
        Update an existing item and clear the cache to ensure the latest item is fetched.
        """
        item = self.get_object()
        serializer = self.get_serializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            conn = get_redis_connection("default")
            item_id = self.kwargs['pk']
            conn.delete(item_id)
            logger.info("Item %s updated and cache invalidated", item_id)
            return Response(serializer.data)
        else:
            logger.error("Error updating item %s: %s", self.kwargs['pk'], serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Delete an item and remove it from the cache.
        """
        item = self.get_object()
        item_id = self.kwargs['pk']
        conn = get_redis_connection("default")
        self.perform_destroy(item)

        conn.delete(item_id)
        logger.info("Item %s deleted and removed from cache", item_id)

        return Response(status=status.HTTP_204_NO_CONTENT)