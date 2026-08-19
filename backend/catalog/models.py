from django.db import models


class Product(models.Model):
    FORMAT_CHOICES = [
        ("lp", "LP"),
        ("ep", "EP"),
        ("7inch", '7"'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    artist = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price_cents = models.PositiveIntegerField(help_text="Price in cents (e.g. 2499 = $24.99)")
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default="lp")
    genre = models.CharField(max_length=100, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    image_url = models.URLField(blank=True)
    stock = models.PositiveIntegerField(default=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.artist} — {self.name}"

    @property
    def price_display(self):
        return f"${self.price_cents / 100:.2f}"
