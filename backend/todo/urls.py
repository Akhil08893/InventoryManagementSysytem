from django.urls import path,include

from . import views


from .views import ItemCreateView, ItemDetailView,ItemListView

urlpatterns = [
    path('items/get',ItemListView.as_view(),name='items'),
    path('items/', ItemCreateView.as_view(), name='item-create'),
    path('items/<int:pk>/', ItemDetailView.as_view(), name='item-detail'),
]

