import re
from urllib.parse import urlparse

def clean_price(price_str):
    """
    Clean price string and convert to float
    """
    if not price_str:
        return 0.0
    
    # Remove currency symbols and commas
    cleaned = re.sub(r'[$,£€]', '', str(price_str))
    
    # Extract first number found (useful for ranges like $10 - $20)
    match = re.search(r'\d+(\.\d+)?', cleaned)
    if match:
        return float(match.group(0))
    
    return 0.0

def extract_domain(url):
    """
    Extract domain name from URL
    """
    if not url:
        return ""
    
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    
    # Remove www. prefix if present
    if domain.startswith('www.'):
        domain = domain[4:]
    
    return domain

def normalize_rating(rating, max_rating=5.0):
    """
    Normalize rating to a scale of 0-5
    """
    if not rating:
        return 0.0
    
    try:
        rating_val = float(rating)
        
        # If rating is already on a 0-5 scale
        if 0 <= rating_val <= 5:
            return rating_val
        
        # If rating is on a 0-10 scale
        if 0 <= rating_val <= 10:
            return rating_val / 2
        
        # If rating is percentage
        if 0 <= rating_val <= 100:
            return rating_val / 20
        
        return 0.0
    except:
        return 0.0

def get_store_reputation_score(store):
    """
    Return a reputation score for known e-commerce stores
    Scale: 0-10
    """
    reputation_scores = {
        'amazon': 9.0,
        'walmart': 8.5,
        'ebay': 7.5,
        'bestbuy': 8.0,
        'target': 8.0,
        'aliexpress': 6.5,
        'etsy': 7.8,
        'newegg': 7.7,
        'macys': 7.5,
        'costco': 8.5
    }
    
    # Normalize store name
    store_name = store.lower() if store else ""
    
    # Return score if found, otherwise return average score
    return reputation_scores.get(store_name, 7.0)
