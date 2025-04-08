from django.core.management.base import BaseCommand
from shop.models import Item

class Command(BaseCommand):
    help = 'Adds the apple item to the database with ID 5'

    def handle(self, *args, **options):
        # Check if apple already exists
        try:
            apple = Item.objects.get(id=5)
            self.stdout.write(self.style.SUCCESS(f'Apple already exists with ID: {apple.id}'))
            return
        except Item.DoesNotExist:
            pass
        
        # Create apple with ID 5
        apple = Item.objects.create(
            id=5,
            name='APPLE',
            description='Increase your hunger by 5%',
            price=5,
            image='src/assets/images/apple.png'
        )
        
        self.stdout.write('\033[92m' + f'✅ Successfully added apple with ID: {apple.id}' + '\033[0m')
        
        # Print additional colorful confirmation
        self.stdout.write('\033[94m' + 'Item added to database with the following details:' + '\033[0m')
        self.stdout.write('\033[93m' + f'  • Name: {apple.name}' + '\033[0m')
        self.stdout.write('\033[93m' + f'  • Price: {apple.price}' + '\033[0m')
        self.stdout.write('\033[93m' + f'  • Description: {apple.description}' + '\033[0m')
