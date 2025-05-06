import os

class Config:
    SECRET_KEY = os.environ.get('SESSION_SECRET', 'dev-secret-key')
    
    # Database - SQLite
    SQLALCHEMY_DATABASE_URI = 'sqlite:///mydatabase.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT 
    JWT_SECRET_KEY = os.environ.get('SESSION_SECRET', 'dev-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 2592000  # 30 days
    
    # RapidAPI
    RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY', '')
    
    # Supported E-commerce sites
    SUPPORTED_SITES = [
        'amazon',
        'walmart',
        'ebay',
        'aliexpress',
        'shopify'
    ]
    
    # MB/CB Analysis weights
    WEIGHT_PRICE = 0.4
    WEIGHT_RATING = 0.3
    WEIGHT_SHIPPING = 0.2
    WEIGHT_STORE_REPUTATION = 0.1
