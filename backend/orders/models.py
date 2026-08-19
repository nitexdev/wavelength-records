from django.db import models


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    ]

    stripe_session_id = models.CharField(max_length=255, unique=True)
    customer_email = models.EmailField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    amount_total_cents = models.PositiveIntegerField(default=0)
    line_items = models.JSONField(default=list, help_text="Snapshot of purchased items")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order {self.id} — {self.status}"
