from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from shop.models import Item, InventoryItem
import sys

class Command(BaseCommand):
    help = 'Adds items directly to a user\'s inventory'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the user')
        parser.add_argument('item_id', type=int, help='ID of the item to add')
        parser.add_argument('quantity', type=int, help='Quantity to add')

    def handle(self, *args, **options):
        username = options['username']
        item_id = options['item_id']
        quantity = options['quantity']
        
        try:
            # Check if user exists
            try:
                user = User.objects.get(username=username)
                self.stdout.write(self.style.SUCCESS(f'Found user: {user.username}'))
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'User {username} does not exist'))
                sys.exit(1)
            
            # Check if item exists
            try:
                item = Item.objects.get(id=item_id)
                self.stdout.write(self.style.SUCCESS(f'Found item: {item.name} (ID: {item.id})'))
            except Item.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Item with ID {item_id} does not exist'))
                # Show available items
                self.stdout.write('\nAvailable items:')
                for item in Item.objects.all():
                    self.stdout.write(f'  ID: {item.id}, Name: {item.name}')
                sys.exit(1)
            
            # Add to inventory
            inventory_item, created = InventoryItem.objects.get_or_create(
                user=user,
                item=item,
                defaults={'quantity': 0}
            )
            
            old_quantity = inventory_item.quantity
            inventory_item.quantity += quantity
            inventory_item.save()
            
            if created:
                self.stdout.write(self.style.SUCCESS(
                    f'Created new inventory entry: {quantity} {item.name} for {user.username}'
                ))
            else:
                self.stdout.write(self.style.SUCCESS(
                    f'Updated inventory: {old_quantity} → {inventory_item.quantity} {item.name} for {user.username}'
                ))
                
            # Show current inventory
            self.stdout.write('\nCurrent inventory for user:')
            for inv_item in InventoryItem.objects.filter(user=user):
                self.stdout.write(f'  {inv_item.quantity}x {inv_item.item.name} (ID: {inv_item.item.id})')
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
            sys.exit(1)
