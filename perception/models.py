from django.db import models

# Create your models here.
class Crime(models.Model):
    year = models.IntegerField(null = True)
    street_id = models.IntegerField(null = True)
    street_name = models.CharField(max_length = 100, null = True)
    attempted_murder = models.IntegerField(null = True)
    sexual_assault = models.IntegerField(null = True)
    vehicle_theft = models.IntegerField(null = True)
    shoplifting = models.IntegerField(null = True)
    drunk_driving = models.IntegerField(null = True)
    damage_to_property = models.IntegerField(null = True)

    def __str__(self):
        return f"{self.street_id} | {self.year} | {self.street_name}"

class Contact(models.Model):
    name = models.CharField(max_length = 100)
    email_address = models.EmailField(max_length = 254)
    phone_number = models.IntegerField()
    subject = models.CharField(max_length = 500)
    message = models.TextField()

    def __str__(self):
        return f"{self.name} | {self.email_address}"