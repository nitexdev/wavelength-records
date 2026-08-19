from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "artist", "price_display", "format", "genre", "stock", "is_active"]
    list_filter = ["format", "genre", "is_active"]
    search_fields = ["name", "artist"]
    prepopulated_fields = {"slug": ("name",)}
