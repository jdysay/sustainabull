from django.core.management.base import BaseCommand
from shop.models import Item

class Command(BaseCommand):
    help = 'Adds the hay item to the database with ID 2'

    def handle(self, *args, **options):
        # Check if hay already exists
        try:
            hay = Item.objects.get(id=2)
            self.stdout.write(self.style.SUCCESS(f'Hay already exists with ID: {hay.id}'))
            return
        except Item.DoesNotExist:
            pass
        
        # Create hay with ID 2
        hay = Item.objects.create(
            id=2,
            name='HAY',
            description='Increase your hunger by 15%',
            price=15,
            image='src/assets/images/hay.png'
        )
        
        self.stdout.write('\033[92m' + f'✅ Successfully added hay with ID: {hay.id}' + '\033[0m')
        
        # Print additional colorful confirmation
        self.stdout.write('\033[94m' + 'Item added to database with the following details:' + '\033[0m')
        self.stdout.write('\033[93m' + f'  • Name: {hay.name}' + '\033[0m')
        self.stdout.write('\033[93m' + f'  • Price: {hay.price}' + '\033[0m')
        self.stdout.write('\033[93m' + f'  • Description: {hay.description}' + '\033[0m')
