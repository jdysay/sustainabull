from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
import math

class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.CharField(max_length=255, blank=True)  # Store image URL or path

    def __str__(self):
        return self.name

class InventoryItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='inventory_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.item.name} ({self.quantity}) for {self.user.username}"

class TransportationType(models.TextChoices):
    WALK = 'walk', 'Walk'
    BIKE = 'bike', 'Bike'
    TRANSIT = 'transit', 'Public Transit'
    VEHICLE = 'vehicle', 'Vehicle'

class Cow(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cow')
    cow_name = models.CharField(max_length=100)
    cow_level = models.PositiveIntegerField(default=1)
    experience_points = models.PositiveIntegerField(default=0)
    
    # Percentage stats (0-100)
    mood = models.PositiveIntegerField(
        default=100,  # Start with full mood
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    hunger = models.PositiveIntegerField(
        default=50,  # Start with medium hunger
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    co2_emissions = models.PositiveIntegerField(
        default=0,  # Start with no emissions (good state)
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    exercise = models.PositiveIntegerField(
        default=0,  # Start with no exercise
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    total_distance_traveled = models.PositiveIntegerField(default=0)  # in meters
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.cow_name} (Level {self.cow_level}) - {self.user.username}'s cow"
    
    # XP thresholds by level
    XP_THRESHOLDS = {
        1: 100,   # Level 1 to 2: 100 XP
        2: 250,   # Level 2 to 3: 250 XP
        3: 500,   # Level 3 to 4: 500 XP
        4: 900,   # Level 4 to 5: 900 XP
        5: 1500,  # Level 5 to 6: 1500 XP
        6: 2500,  # Level 6 to 7: 2500 XP
        7: 4000,  # Level 7 to 8: 4000 XP
        8: 6000,  # Level 8 to 9: 6000 XP
        9: 9000,  # Level 9 to 10: 9000 XP
        10: float('inf')  # Level 10 cap
    }

    def feed(self, item, quantity=1):
        """Feed the cow with an item to increase hunger satisfaction"""
        # Calculate hunger increase based on item price (1:1 ratio)
        hunger_increase = int(item.price) * quantity
        
        # Update hunger, ensuring it doesn't exceed 100
        old_hunger = self.hunger
        self.hunger = min(100, self.hunger + hunger_increase)
        self.save()
        
        return {
            'previous_hunger': old_hunger,
            'current_hunger': self.hunger,
            'increase': hunger_increase
        }
    
    def travel(self, distance_meters, transport_type):
        """Process travel activity and update stats accordingly"""
        old_co2 = self.co2_emissions
        old_exercise = self.exercise
        old_mood = self.mood
        old_xp = self.experience_points
        old_level = self.cow_level
        
        # Update total distance
        self.total_distance_traveled += distance_meters
        
        # Calculate base XP: distance / 10
        base_xp = distance_meters // 10
        actual_xp = base_xp
        
        # Update CO2 emissions based on transport type
        if transport_type == TransportationType.WALK or transport_type == TransportationType.BIKE:
            # Reduce CO2 by 10% when walking or biking
            self.co2_emissions = max(0, self.co2_emissions - 10)
            # Increase exercise when walking or biking
            self.exercise = min(100, self.exercise + 15)
        elif transport_type == TransportationType.TRANSIT:
            # No change to CO2 for transit
            pass
        elif transport_type == TransportationType.VEHICLE:
            # Increase CO2 by 20% when using vehicle
            self.co2_emissions = min(100, self.co2_emissions + 20)
        
        # Decrease hunger when traveling
        distance_km = distance_meters / 1000
        hunger_decrease = min(5, int(distance_km))  # 1% hunger decrease per km, max 5%
        self.hunger = max(0, self.hunger - hunger_decrease)
        
        # Mood logic: affected by hunger and CO2
        # Hunger effect on mood
        if self.hunger < 25:
            self.mood = max(0, self.mood - 5)  # Low food makes mood worse
        elif self.hunger > 75:
            self.mood = min(100, self.mood + 3)  # Plenty of food improves mood
            
        # CO2 effect on mood
        if self.co2_emissions > 80:
            self.mood = max(0, self.mood - 8)  # High emissions decrease mood
        
        # XP modifications based on cow state
        if self.mood < 25 or self.co2_emissions >= 100:
            actual_xp = 0  # No XP gain when mood is very low or CO2 is maxed
        elif self.mood < 50:
            actual_xp = int(base_xp * 0.8)  # 20% XP reduction for moderate mood issues
        
        # Add gold to user (1:1 with distance)
        user = self.user
        user.gold = user.gold + distance_meters
        user.save()
        
        # Add XP and check for level up
        self.experience_points += actual_xp
        self._check_level_up()
        
        # Save all changes
        self.save()
        
        return {
            'distance_traveled': distance_meters,
            'transport_type': transport_type,
            'xp_gained': actual_xp,
            'gold_gained': distance_meters,
            'co2_change': self.co2_emissions - old_co2,
            'exercise_change': self.exercise - old_exercise,
            'mood_change': self.mood - old_mood,
            'hunger_change': -hunger_decrease,
            'leveled_up': self.cow_level > old_level,
            'new_level': self.cow_level if self.cow_level > old_level else None
        }
    
    def _check_level_up(self):
        """Check if cow has enough XP to level up"""
        if self.cow_level >= 10:  # Cap at level 10
            return False
            
        # Get XP needed for next level
        xp_needed = self.XP_THRESHOLDS[self.cow_level]
        
        if self.experience_points >= xp_needed:
            # Level up and reset XP
            self.cow_level += 1
            self.experience_points = 0
            return True
        return False

class TransportationLog(models.Model):
    cow = models.ForeignKey(Cow, on_delete=models.CASCADE, related_name='transportation_logs')
    transport_type = models.CharField(
        max_length=20,
        choices=TransportationType.choices,
        default=TransportationType.WALK
    )
    distance_meters = models.PositiveIntegerField()
    xp_gained = models.PositiveIntegerField()
    gold_gained = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.cow.cow_name} traveled {self.distance_meters}m by {self.transport_type}"

