from django.core.management.base import BaseCommand
from catalog.models import Product

SAMPLE_PRODUCTS = [
    {
        "name": "In Rainbows",
        "artist": "Radiohead",
        "slug": "in-rainbows",
        "price_cents": 2899,
        "format": "lp",
        "genre": "Alternative",
        "year": 2007,
        "description": "180g reissue, gatefold sleeve.",
        "stock": 12,
    },
    {
        "name": "Blue Train",
        "artist": "John Coltrane",
        "slug": "blue-train",
        "price_cents": 3299,
        "format": "lp",
        "genre": "Jazz",
        "year": 1957,
        "description": "Classic Blue Note pressing, remastered.",
        "stock": 8,
    },
    {
        "name": "Rumours",
        "artist": "Fleetwood Mac",
        "slug": "rumours",
        "price_cents": 2599,
        "format": "lp",
        "genre": "Rock",
        "year": 1977,
        "description": "Standard black vinyl, includes lyric insert.",
        "stock": 15,
    },
    {
        "name": "Voodoo",
        "artist": "D'Angelo",
        "slug": "voodoo",
        "price_cents": 3499,
        "format": "lp",
        "genre": "Soul",
        "year": 2000,
        "description": "Double LP, gatefold.",
        "stock": 6,
    },
    {
        "name": "Homework",
        "artist": "Daft Punk",
        "slug": "homework",
        "price_cents": 3799,
        "format": "lp",
        "genre": "Electronic",
        "year": 1997,
        "description": "Double LP reissue.",
        "stock": 10,
    },
    {
        "name": "Untitled (Black Is)",
        "artist": "Sault",
        "slug": "untitled-black-is",
        "price_cents": 2999,
        "format": "lp",
        "genre": "Soul",
        "year": 2020,
        "description": "Limited pressing.",
        "stock": 5,
    },
]


class Command(BaseCommand):
    help = "Seeds the catalog with sample vinyl records for local testing."

    def handle(self, *args, **options):
        created = 0
        for data in SAMPLE_PRODUCTS:
            _, was_created = Product.objects.get_or_create(slug=data["slug"], defaults=data)
            if was_created:
                created += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded {created} new product(s)."))
