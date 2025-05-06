from utils import clean_price, normalize_rating, get_store_reputation_score

def calculate_mb_cb(product):
    """
    Calculate Marginal Benefit (MB) and Cost Benefit (CB) scores for a product
    
    MB formula: Higher is better
    - Product rating (weighted)
    - Store reputation (weighted)
    - Inverse of shipping cost (weighted)
    
    CB formula: Higher is better
    - Inverse of price (weighted)
    - Inverse of shipping cost (weighted)
    """
    # Extract and normalize product data
    price = float(product.get('price', 0))
    rating = normalize_rating(product.get('rating', 0))
    shipping_cost = float(product.get('shipping_cost', 0))
    store = product.get('store', '')
    
    # Get store reputation score (0-10)
    store_reputation = get_store_reputation_score(store)
    
    # Define weights for various factors
    WEIGHT_PRICE = 0.6
    WEIGHT_RATING = 0.3
    WEIGHT_SHIPPING = 0.2
    WEIGHT_STORE_REPUTATION = 0.1
    
    # Calculate Marginal Benefit (MB)
    # Scale each component to be between 0-1 (higher is better)
    normalized_rating = rating / 5.0  # assuming rating is on a 0-5 scale
    normalized_store_reputation = store_reputation / 10.0
    
    # For shipping cost, lower is better, so we inverse it (1 / (1 + shipping_cost))
    # This ensures that free shipping gets a score of 1, and higher shipping costs get lower scores
    normalized_shipping = 1 / (1 + shipping_cost)
    
    mb_score = (
        (normalized_rating * WEIGHT_RATING) +
        (normalized_store_reputation * WEIGHT_STORE_REPUTATION) +
        (normalized_shipping * WEIGHT_SHIPPING)
    )
    
    # Calculate Cost Benefit (CB)
    # For price, lower is better, but we need to normalize it
    # Since price ranges widely, we use a logarithmic scaling
    # First, ensure price is not zero
    price = max(price, 0.01)
    
    # Inverse log scaling: 1 / log(1 + price)
    # This gives higher scores to lower prices
    normalized_price = 1 / (1 + price)
    
    cb_score = (
        (normalized_price * WEIGHT_PRICE) +
        (normalized_shipping * WEIGHT_SHIPPING)
    )
    
    # Scale scores to be 0-100 for easier interpretation
    mb_score = round(mb_score * 100, 2)
    cb_score = round(cb_score * 100, 2)
    
    return mb_score, cb_score

def calculate_optimal_purchase_combination(products):
    """
    Calculate the optimal combination of products across different e-shops
    
    This function handles more complex scenarios where buying multiple products
    from one store might be better due to combined shipping costs.
    """
    if not products:
        return []
    
    # Group products by store
    stores = {}
    for product in products:
        store = product.get('store', '')
        if store not in stores:
            stores[store] = []
        stores[store].append(product)
    
    # Calculate scores for buying all products from each store
    store_scores = {}
    for store, store_products in stores.items():
        # Sum of product prices
        total_price = sum(float(p.get('price', 0)) for p in store_products)
        
        # Shipping cost (assume highest product's shipping cost applies once)
        shipping_cost = max(float(p.get('shipping_cost', 0)) for p in store_products)
        
        # Average rating
        avg_rating = sum(normalize_rating(p.get('rating', 0)) for p in store_products) / len(store_products)
        
        # Store reputation
        store_reputation = get_store_reputation_score(store)
        
        # Calculate combined MB and CB scores
        mb_score, cb_score = calculate_combined_scores(
            total_price, 
            avg_rating, 
            shipping_cost, 
            store_reputation
        )
        
        store_scores[store] = {
            'products': store_products,
            'total_price': total_price,
            'shipping_cost': shipping_cost,
            'mb_score': mb_score,
            'cb_score': cb_score,
            'total_score': mb_score + cb_score
        }
    
    # Find the store with the highest score
    best_store = max(store_scores.items(), key=lambda x: x[1]['total_score'])
    
    return {
        'best_store': best_store[0],
        'products': best_store[1]['products'],
        'total_price': best_store[1]['total_price'],
        'shipping_cost': best_store[1]['shipping_cost'],
        'total_cost': best_store[1]['total_price'] + best_store[1]['shipping_cost'],
        'mb_score': best_store[1]['mb_score'],
        'cb_score': best_store[1]['cb_score'],
        'total_score': best_store[1]['total_score']
    }

def calculate_combined_scores(price, rating, shipping_cost, store_reputation):
    """
    Calculate combined MB and CB scores for multiple products from the same store
    """
    # Define weights
    WEIGHT_PRICE = 0.6
    WEIGHT_RATING = 0.3
    WEIGHT_SHIPPING = 0.2
    WEIGHT_STORE_REPUTATION = 0.1
    
    # Normalize values
    normalized_rating = rating / 5.0
    normalized_store_reputation = store_reputation / 10.0
    normalized_shipping = 1 / (1 + shipping_cost)
    
    # Ensure price is not zero
    price = max(price, 0.01)
    normalized_price = 1 / (1 + price)
    
    # Calculate scores
    mb_score = (
        (normalized_rating * WEIGHT_RATING) +
        (normalized_store_reputation * WEIGHT_STORE_REPUTATION) +
        (normalized_shipping * WEIGHT_SHIPPING)
    )
    
    cb_score = (
        (normalized_price * WEIGHT_PRICE) +
        (normalized_shipping * WEIGHT_SHIPPING)
    )
    
    # Scale to 0-100
    mb_score = round(mb_score * 100, 2)
    cb_score = round(cb_score * 100, 2)
    
    return mb_score, cb_score
