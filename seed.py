from app import app
from extensions import db
from models import Product
from flask import current_app

# Seed data for products
products = [
    {
        "title": "Wireless Mouse",
        "description": "A high-precision wireless mouse with ergonomic design.",
        "price": 25.99,
        "rating": 4.5,
        "store": "TechStore",
        "url": "https://techstore.com/wireless-mouse",
        "image_url": "https://techstore.com/images/wireless-mouse.jpg",
        "shipping_cost": 5.99,
        "mb_score": 8.5,
        "cb_score": 9.0
    },
    {
        "title": "Bluetooth Headphones",
        "description": "Noise-cancelling over-ear headphones with long battery life.",
        "price": 89.99,
        "rating": 4.7,
        "store": "AudioWorld",
        "url": "https://audioworld.com/bluetooth-headphones",
        "image_url": "https://audioworld.com/images/bluetooth-headphones.jpg",
        "shipping_cost": 7.99,
        "mb_score": 9.2,
        "cb_score": 8.8
    },
    {
        "title": "Gaming Keyboard",
        "description": "Mechanical keyboard with customizable RGB lighting.",
        "price": 59.99,
        "rating": 4.6,
        "store": "GamerZone",
        "url": "https://gamerzone.com/gaming-keyboard",
        "image_url": "https://gamerzone.com/images/gaming-keyboard.jpg",
        "shipping_cost": 6.99,
        "mb_score": 8.8,
        "cb_score": 9.1
    }
]

# Debugging: Check if app context is active
if not current_app:
    print("App context is not active. Ensure app context is pushed correctly.")
else:
    print("App context is active.")

# Ensure app context is pushed
with app.app_context():
    print("Seeding database...")
    for product_data in products:
        product = Product(**product_data)
        db.session.add(product)
    db.session.commit()
    print("Database seeded successfully!")

print("Database seeded with products!")