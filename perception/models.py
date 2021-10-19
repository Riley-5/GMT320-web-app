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

    def serialize(self):
        return {
            "year": self.year,
            "street_name": self.street_name,
            "attempted_murder": self.attempted_murder,
            "sexual_assault": self.sexual_assault,
            "vehicle_theft": self.vehicle_theft,
            "shoplifting": self.shoplifting,
            "drunk_driving": self.drunk_driving,
            "damage_to_property": self.damage_to_property
        }