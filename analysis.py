from utils import clean_price, normalize_rating, get_store_reputation_score

# Updated MB and CB formulas based on user-provided computations
def calculate_mb_cb(product):
    """
    Calculate Marginal Benefit (MB) and Cost Benefit (CB) scores for a product

    MB formula:
    MB = (R * log(N+1)) * M / (C + D)

    CB formula:
    CB = MB / (C + D)

    Where:
    R = Rating
    N = Number of ratings (number of reviews/comments)
    M = Mode of payment factor (1.1 for Pay after delivery, 1.0 for Pay before)
    C = Product cost
    D = Delivery cost
    """
    import math

    # Extract product attributes
    R = float(product.get('rating', 0))
    # Use number of reviews/comments as N
    reviews = product.get('reviews')
    if isinstance(reviews, list):
        N = len(reviews)
    else:
        N = 0
    M = 1.1 if product.get('payment_mode', '').lower() == 'pay after delivery' else 1.0
    C = float(product.get('price', 0))
    D = float(product.get('delivery_cost', 0))

    # Calculate MB
    try:
        MB = (R * math.log(N + 1)) * M / (C + D)
    except ZeroDivisionError:
        MB = 0

    # Calculate CB
    try:
        CB = MB / (C + D)
    except ZeroDivisionError:
        CB = 0

    # Scale scores for easier interpretation
    MB = round(MB * 1000, 6)
    CB = round(CB * 1000, 6)

    return MB, CB

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
