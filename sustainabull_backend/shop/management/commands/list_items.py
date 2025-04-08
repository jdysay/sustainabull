from django.core.management.base import BaseCommand
from shop.models import Item

class Command(BaseCommand):
    help = 'Lists all items in the database'

    def handle(self, *args, **options):
        items = Item.objects.all().order_by('id')
        
        if not items:
            self.stdout.write(self.style.WARNING('No items found in the database.'))
            return
        
        self.stdout.write(self.style.SUCCESS(f'Found {items.count()} items:'))
        self.stdout.write('-' * 80)
        self.stdout.write(f'{"ID":<5} {"Name":<20} {"Price":<10} {"Description":<45}')
        self.stdout.write('-' * 80)
        
        for item in items:
            self.stdout.write(
                f'{item.id:<5} {item.name:<20} ${float(item.price):<9.2f} {item.description[:45]:<45}'
            )
            
        self.stdout.write('-' * 80)
