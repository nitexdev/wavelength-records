from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """Public, read-only catalog. Products are managed via the Django admin."""

    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        genre = self.request.query_params.get("genre")
        format_ = self.request.query_params.get("format")
        if genre:
            qs = qs.filter(genre__iexact=genre)
        if format_:
            qs = qs.filter(format=format_)
        return qs
