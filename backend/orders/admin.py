from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "customer_email", "status", "amount_total_cents", "created_at"]
    list_filter = ["status"]
    readonly_fields = ["stripe_session_id", "line_items", "created_at", "updated_at"]
