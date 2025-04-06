from django.core.management.base import BaseCommand
from shop.models import Item

class Command(BaseCommand):
    help = 'Creates initial shop items'

    def handle(self, *args, **kwargs):
        items = [
            {
                'id': 1,
                'name': 'GRASS',
                'description': 'Increase your hunger by 10%',
                'price': 10.0,
            'image': 'src/assets/images/grass.png'
            },
            {
                'id': 2,
                'name': 'HAY',
                'description': 'Increase your hunger by 15%',
                'price': 15.0,
                'image': 'src/assets/images/hay.png'
            },
            {
                'id': 3,
                'name': 'CARROT',
                'description': 'Increase your hunger by 25%',
                'price': 25.0,
                'image': 'src/assets/images/carrot.png'
            },
            {
                'id': 4,
                'name': 'CORN CHUNKS',
                'description': 'Increase your hunger by 20%',
                'price': 20.0,
                'image': 'src/assets/images/corn.png'
            },
            {
                'id': 5,
                'name': 'APPLE',
                'description': 'Increase your hunger by 5%',
                'price': 5.0,
                'image': 'src/assets/images/apple.png'
            },
            {
                'id': 6,
                'name': 'CAKE',
                'description': 'Increase your hunger by 30%',
                'price': 30.0,
                'image': 'src/assets/images/cake.png'
            },
        ]

        for item_data in items:
            Item.objects.get_or_create(
                id=item_data['id'],
                defaults={
                    'name': item_data['name'],
                    'description': item_data['description'],
                    'price': item_data['price'],
                    'image': item_data['image']
                }
            )
            
        self.stdout.write(self.style.SUCCESS(f'Created {len(items)} items'))