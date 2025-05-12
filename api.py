import os
import json
from flask import Blueprint, request, jsonify
from models import db, SearchHistory, Product
from flask_jwt_extended import jwt_required, get_jwt_identity
from analysis import calculate_mb_cb, calculate_optimal_purchase_combination
from config import Config

api_bp = Blueprint('api', __name__)

# Search products using static/products.json only
@api_bp.route('/api/search', methods=['GET'])
@jwt_required(optional=True)
def search_products():
    query = request.args.get('query', '').strip()
    if not query:
        return jsonify({"error": "Search query is required"}), 400

    # Load products from static/products.json
    products_path = os.path.join(os.path.dirname(__file__), 'static', 'products.json')
    with open(products_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        all_products = data.get('products', data)  # handle both {products: [...]} and [...] formats

    # Filter products by query (case-insensitive, in name, category, or platform)
    query_lower = query.lower()
    results = [
        p for p in all_products
        if query_lower in str(p.get('name', '')).lower()
        or query_lower in str(p.get('category', '')).lower()
        or query_lower in str(p.get('platform', '')).lower()
    ]

    # Apply MB/CB analysis
    for product in results:
        mb_score, cb_score = calculate_mb_cb(product)
        product['mb_score'] = mb_score
        product['cb_score'] = cb_score

    # Sort results by MB/CB score (higher is better)
    results.sort(key=lambda x: (x.get('mb_score', 0) + x.get('cb_score', 0)), reverse=True)

    return jsonify({
        "query": query,
        "results": results,
        "count": len(results)
    }), 200

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

# Optionally, add an endpoint for optimal purchase combination
@api_bp.route('/api/optimal-combination', methods=['POST'])
@jwt_required(optional=True)
def optimal_combination():
    data = request.get_json()
    products = data.get('products', [])
    if not products:
        return jsonify({"error": "No products provided"}), 400
    result = calculate_optimal_purchase_combination(products)
    return jsonify(result), 200
