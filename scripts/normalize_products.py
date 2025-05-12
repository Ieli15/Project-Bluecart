import json
import random

# Spec options
smartphone_brands = ["OnePlus 9", "Samsung Galaxy S22", "iPhone 14 Pro", "Google Pixel 8"]
smartphone_storages = [512, 256, 128]
smartphone_rams = [16, 8]
smartphone_price_map = {(512, 16): 1649, (512, 8): 1499, (256, 16): 1399, (256, 8): 1249, (128, 16): 999, (128, 8): 380}

laptop_brands = ["Dell XPS 13", "MacBook Pro", "HP Spectre x360", "Lenovo ThinkPad X1"]
laptop_ssds = [512, 256, 128]
laptop_rams = [24, 16, 8]
laptop_price_map = {(512, 24): 2680, (512, 16): 2399, (512, 8): 1999, (256, 24): 1899, (256, 16): 1599, (256, 8): 1299, (128, 24): 1199, (128, 16): 899, (128, 8): 521}

def avg_rating(reviews):
    if not reviews:
        return 0
    return round(sum(r['rating'] for r in reviews) / len(reviews), 1)

def normalize():
    with open('../static/products.json') as f:
        data = json.load(f)
    new_products = []
    id_counter = 1
    for p in data['products']:
        # Smartphones
        if p['category'].lower() == 'smartphones':
            brand = random.choice(smartphone_brands)
            storage = random.choice(smartphone_storages)
            ram = random.choice(smartphone_rams)
            name = f"{brand} {storage}GB, {ram}GB RAM"
            price = smartphone_price_map[(storage, ram)]
            p['name'] = name
            p['price'] = float(price)
        # Laptops
        elif p['category'].lower() == 'laptops':
            brand = random.choice(laptop_brands)
            ssd = random.choice(laptop_ssds)
            ram = random.choice(laptop_rams)
            name = f"{brand} {ram}GB RAM, {ssd}GB SSD"
            price = laptop_price_map[(ssd, ram)]
            p['name'] = name
            p['price'] = float(price)
        # Fix rating
        p['rating'] = avg_rating(p.get('reviews', []))
        p['id'] = id_counter
        id_counter += 1
        new_products.append(p)
    data['products'] = new_products
    with open('../static/products.json', 'w') as f:
        json.dump(data, f, indent=2)
    print('products.json normalized.')

if __name__ == '__main__':
    normalize()
