from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    price_display = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "artist", "description",
            "price_cents", "price_display", "format", "genre",
            "year", "image_url", "stock",
        ]
