import os
import requests
import json
from flask import Blueprint, request, jsonify
from models import db, SearchHistory, Product
from flask_jwt_extended import jwt_required, get_jwt_identity
from analysis import calculate_mb_cb
from config import Config

api_bp = Blueprint('api', __name__)

# RapidAPI key
RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY', '')

# Search products across multiple e-commerce platforms
@api_bp.route('/api/search', methods=['GET'])
@jwt_required(optional=True)
def search_products():
    query = request.args.get('query', '')
    page = request.args.get('page', 1, type=int)
    
    if not query:
        return jsonify({"error": "Search query is required"}), 400
    
    # Get current user if authenticated
    current_user_id = get_jwt_identity()
    
    # Collect results from multiple e-commerce APIs
    results = []
    
    # Amazon search via RapidAPI
    try:
        amazon_results = search_amazon(query, page)
        results.extend(amazon_results)
    except Exception as e:
        print(f"Amazon search error: {str(e)}")
    
    # Walmart search via RapidAPI
    try:
        walmart_results = search_walmart(query, page)
        results.extend(walmart_results)
    except Exception as e:
        print(f"Walmart search error: {str(e)}")
    
    # eBay search via RapidAPI
    try:
        ebay_results = search_ebay(query, page)
        results.extend(ebay_results)
    except Exception as e:
        print(f"eBay search error: {str(e)}")
    
    # Apply MB/CB analysis
    for product in results:
        mb_score, cb_score = calculate_mb_cb(product)
        product['mb_score'] = mb_score
        product['cb_score'] = cb_score
    
    # Sort results by MB/CB score (higher is better)
    results.sort(key=lambda x: (x.get('mb_score', 0) + x.get('cb_score', 0)), reverse=True)
    
    # Save search to history if user is authenticated
    if current_user_id:
        search_history = SearchHistory(
            user_id=current_user_id,
            query=query,
            results=results
        )
        db.session.add(search_history)
        db.session.commit()
    
    return jsonify({
        "query": query,
        "results": results,
        "count": len(results)
    }), 200

# Search Amazon products via RapidAPI
def search_amazon(query, page=1):
    url = "https://amazon-price1.p.rapidapi.com/search"
    
    querystring = {"keywords": query, "page": page}
    
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "amazon-price1.p.rapidapi.com"
    }
    
    response = requests.get(url, headers=headers, params=querystring)
    
    if response.status_code != 200:
        return []
    
    data = response.json()
    
    # Transform Amazon data to our standard format
    results = []
    for item in data:
        product = {
            'title': item.get('title', ''),
            'price': float(item.get('price', '0').replace('$', '').replace(',', '')) if item.get('price') else 0,
            'rating': float(item.get('rating', 0)),
            'store': 'Amazon',
            'url': item.get('detailPageURL', ''),
            'image_url': item.get('imageUrl', ''),
            'shipping_cost': 0,  # Amazon often has free shipping with Prime
            'description': item.get('description', '')
        }
        results.append(product)
    
    return results

# Search Walmart products via RapidAPI
def search_walmart(query, page=1):
    url = "https://walmart.p.rapidapi.com/products/search"
    
    querystring = {"query": query, "page": page}
    
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "walmart.p.rapidapi.com"
    }
    
    response = requests.get(url, headers=headers, params=querystring)
    
    if response.status_code != 200:
        return []
    
    data = response.json()
    
    # Transform Walmart data to our standard format
    results = []
    items = data.get('items', [])
    for item in items:
        product = {
            'title': item.get('title', ''),
            'price': float(item.get('primaryOffer', {}).get('offerPrice', 0)),
            'rating': float(item.get('customerRating', 0)),
            'store': 'Walmart',
            'url': f"https://www.walmart.com/ip/{item.get('usItemId', '')}",
            'image_url': item.get('imageInfo', {}).get('thumbnailUrl', ''),
            'shipping_cost': item.get('shippingOption', {}).get('shipPrice', 0),
            'description': item.get('description', '')
        }
        results.append(product)
    
    return results

# Search eBay products via RapidAPI
def search_ebay(query, page=1):
    url = "https://ebay-search-result.p.rapidapi.com/search"
    
    querystring = {"q": query, "page": page}
    
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "ebay-search-result.p.rapidapi.com"
    }
    
    response = requests.get(url, headers=headers, params=querystring)
    
    if response.status_code != 200:
        return []
    
    data = response.json()
    
    # Transform eBay data to our standard format
    results = []
    items = data.get('results', [])
    for item in items:
        product = {
            'title': item.get('title', ''),
            'price': float(item.get('price', {}).get('value', 0)),
            'rating': float(item.get('condition', {}).get('rating', 0)),
            'store': 'eBay',
            'url': item.get('url', ''),
            'image_url': item.get('image', {}).get('src', ''),
            'shipping_cost': float(item.get('shipping', {}).get('cost', {}).get('value', 0)),
            'description': item.get('subtitle', '')
        }
        results.append(product)
    
    return results

# Get product comparison
@api_bp.route('/api/compare', methods=['POST'])
def compare_products():
    data = request.get_json()
    
    if not data or 'products' not in data:
        return jsonify({"error": "No products provided for comparison"}), 400
    
    products = data['products']
    
    if len(products) < 2:
        return jsonify({"error": "At least 2 products required for comparison"}), 400
    
    # Apply MB/CB analysis for each product
    for product in products:
        mb_score, cb_score = calculate_mb_cb(product)
        product['mb_score'] = mb_score
        product['cb_score'] = cb_score
        product['total_score'] = mb_score + cb_score
    
    # Sort products by total score (descending)
    products.sort(key=lambda x: x.get('total_score', 0), reverse=True)
    
    return jsonify({
        "products": products,
        "best_value": products[0] if products else None
    }), 200
