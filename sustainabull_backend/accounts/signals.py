from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import WalkLog, Cow, User

@receiver(post_save, sender=WalkLog)
def update_cow_and_user_from_walk(sender, instance, created, **kwargs):
    if not created:
        return

    user = instance.user
    cow = Cow.objects.filter(user=user).first()

    if cow:
        result = cow.gain_experience(instance.distance_m)
        user.coin += result['coin_gain']
        user.save()
