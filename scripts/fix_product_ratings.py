import json

# Load products.json
data_path = '../static/products.json'
with open(data_path, 'r') as f:
    data = json.load(f)

changed = False
for product in data['products']:
    reviews = product.get('reviews', [])
    if reviews:
        avg_rating = round(sum(r['rating'] for r in reviews) / len(reviews), 1)
        if product.get('rating') != avg_rating:
            product['rating'] = avg_rating
            changed = True

if changed:
    with open(data_path, 'w') as f:
        json.dump(data, f, indent=2)
    print('Product ratings updated to match average of user reviews.')
else:
    print('All product ratings already match the average of user reviews.')
