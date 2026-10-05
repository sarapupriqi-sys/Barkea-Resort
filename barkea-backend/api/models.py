from django.db import models

class Villa(models.Model):
    TIPOLOGJIA_CHOICES = [
        ('A', 'Tipologjia A'),
        ('B', 'Tipologjia B'),
        ('C', 'Tipologjia C'),
    ]

    title = models.CharField(max_length=100) # P.sh. Vila 1, Vila 2
    tipologjia = models.CharField(max_length=1, choices=TIPOLOGJIA_CHOICES)
    surface_area = models.DecimalField(max_digits=6, decimal_places=2) # Sipërfaqja në m²
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    has_pool = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_available = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Vila {self.title} - Tipologjia {self.tipologjia}"


class ContactMessage(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    country = models.CharField(max_length=50)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"