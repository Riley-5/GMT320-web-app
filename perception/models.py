from django.db import models

# Create your models here.
class Crime(models.Model):
    year = models.IntegerField(null = True)
    street_name = models.CharField(max_length = 100, null = True)
    attempted_murder = models.IntegerField(null = True)
    sexual_assault = models.IntegerField(null = True)
    vehicle_theft = models.IntegerField(null = True)
    shoplifting = models.IntegerField(null = True)
    drunk_driving = models.IntegerField(null = True)
    damage_to_property = models.IntegerField(null = True)
