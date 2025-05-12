import os
import requests
import json
import logging
from flask import Blueprint, request, jsonify
from models import db, SearchHistory, Product
from flask_jwt_extended import jwt_required, get_jwt_identity
from analysis import calculate_mb_cb
from config import Config
from bs4 import BeautifulSoup
import time
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.DEBUG)

api_bp = Blueprint('api', __name__)

# Path to the products.json file
PRODUCTS_FILE = os.path.join(os.path.dirname(__file__), 'static', 'products.json')

def fetch_amazon_data(query):
    # Mock function to fetch data from Amazon
    return [
        {"name": "Amazon Product 1", "price": 100, "platform": "Amazon"},
        {"name": "Amazon Product 2", "price": 200, "platform": "Amazon"}
    ]

def fetch_ebay_data(query):
    # Mock function to fetch data from eBay
    return [
        {"name": "eBay Product 1", "price": 150, "platform": "eBay"},
        {"name": "eBay Product 2", "price": 250, "platform": "eBay"}
    ]

def fetch_shopify_data(query):
    # Mock function to fetch data from Shopify
    return [
        {"name": "Shopify Product 1", "price": 120, "platform": "Shopify"},
        {"name": "Shopify Product 2", "price": 220, "platform": "Shopify"}
    ]

def fetch_alibaba_data(query):
    # Mock function to fetch data from Alibaba
    return [
        {"name": "Alibaba Product 1", "price": 130, "platform": "Alibaba"},
        {"name": "Alibaba Product 2", "price": 230, "platform": "Alibaba"}
    ]

# Load static data for search
@api_bp.route('/api/search', methods=['GET'])
@jwt_required(optional=True)
def search_products():
    query = request.args.get('query', '').lower()
    sort_by = request.args.get('sort_by', 'price')  # Default sorting by price
    try:
        min_price = float(request.args.get('min_price', 0))
        max_price = float(request.args.get('max_price', float('inf')))
        min_rating = float(request.args.get('min_rating', 0))
    except ValueError:
        return jsonify({"error": "Invalid numeric filter parameter"}), 400

    platform = request.args.get('platform', '').lower()

    if not query:
        return jsonify({"error": "Search query is required"}), 400

    try:
        logging.debug(f"Received search query: {query}")
        with open(PRODUCTS_FILE, 'r') as file:
            products_data = json.load(file)
            products = products_data.get('products', [])

        # Filter products based on the query and additional filters
        filtered_products = [
            product for product in products
            if query in product.get('name', '').lower()
            and min_price <= product.get('price', 0) <= max_price
            and product.get('rating', 0) >= min_rating
            and (platform in product.get('platform', '').lower() if platform else True)
        ]

        # Sort products by the specified field
        if sort_by in ['price', 'rating']:
            filtered_products.sort(key=lambda x: x.get(sort_by, 0), reverse=(sort_by == 'rating'))

        logging.debug(f"Filtered products: {filtered_products}")

        # Store search history in the database only if the user is logged in
        current_user_id = get_jwt_identity()
        if current_user_id:
            search_history_entry = SearchHistory(
                user_id=current_user_id,
                query=query,
                results=filtered_products
            )
            db.session.add(search_history_entry)
            db.session.commit()

        return jsonify({
            "query": query,
            "results": filtered_products,
            "count": len(filtered_products)
        }), 200
    except FileNotFoundError:
        logging.error("Products file not found.")
        return jsonify({"error": "Products file not found."}), 404
    except json.JSONDecodeError as e:
        logging.error(f"Error decoding products file: {e}")
        return jsonify({"error": "Error decoding products file."}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected error occurred."}), 500

# Scrape Amazon products
def scrape_amazon(query, page=1):
    url = f"https://www.amazon.com/s?k={query}&page={page}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Amazon scraping error: {response.status_code}")
        return []

    print(response.text[:1000])  # Debug HTML

    soup = BeautifulSoup(response.content, "html.parser")
    results = []

    for item in soup.select(".s-main-slot .s-result-item"):
        title = item.select_one("h2 .a-link-normal")
        price = item.select_one(".a-price .a-offscreen")
        rating = item.select_one(".a-icon-alt")
        url = item.select_one("h2 .a-link-normal")

        if title and price and url:
            try:
                price_val = float(price.text.replace("$", "").replace(",", ""))
            except ValueError:
                price_val = 0

            try:
                rating_val = float(rating.text.split()[0]) if rating else 0
            except (ValueError, IndexError):
                rating_val = 0

            product = {
                "title": title.text.strip(),
                "price": price_val,
                "rating": rating_val,
                "store": "Amazon",
                "url": f"https://www.amazon.com{url['href']}",
                "image_url": None,
                "shipping_cost": 0,
                "description": None
            }
            results.append(product)

    time.sleep(2)
    return results

def search_walmart(query, page=1):
    pass

# Scrape eBay products
def scrape_ebay(query, page=1):
    url = f"https://www.ebay.com/sch/i.html?_nkw={query}&_pgn={page}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"eBay scraping error: {response.status_code}")
        return []

    soup = BeautifulSoup(response.content, "html.parser")
    results = []

    for item in soup.select(".s-item"):
        title = item.select_one(".s-item__title")
        price = item.select_one(".s-item__price")
        url = item.select_one(".s-item__link")
        image = item.select_one(".s-item__image-img")

        if title and price and url:
            try:
                price_val = float(price.text.replace("$", "").replace(",", "").split()[0])
            except ValueError:
                price_val = 0

            product = {
                "title": title.text.strip(),
                "price": price_val,
                "rating": None,
                "store": "eBay",
                "url": url['href'],
                "image_url": image['src'] if image else None,
                "shipping_cost": 0,
                "description": None
            }
            results.append(product)

    time.sleep(2)
    return results

# Scrape Shopify products
def scrape_shopify(query, page=1):
    print("Shopify scraping is not implemented. Requires store-specific access.")
    return []

# Alibaba search placeholder
def search_alibaba(query, page=1):
    print("Alibaba scraping is handled by scrape_alibaba.")
    return []

# Scrape Alibaba products
def scrape_alibaba(query, page=1):
    url = f"https://www.alibaba.com/trade/search?SearchText={query}&page={page}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Alibaba scraping error: {response.status_code}")
        return []

    soup = BeautifulSoup(response.content, "html.parser")
    results = []

    for item in soup.select(".J-offer-wrapper"):
        title = item.select_one(".elements-title-normal__content")
        price = item.select_one(".elements-offer-price-normal__price")
        url = item.select_one("a")

        if title and price and url:
            try:
                price_val = float(price.text.replace("$", "").replace(",", "").split()[0])
            except ValueError:
                price_val = 0

            product = {
                "title": title.text.strip(),
                "price": price_val,
                "rating": None,
                "store": "Alibaba",
                "url": f"https://www.alibaba.com{url['href']}",
                "image_url": None,
                "shipping_cost": 0,
                "description": None
            }
            results.append(product)

    time.sleep(2)
    return results

# Compare products
@api_bp.route('/api/compare', methods=['POST'])
def compare_products():
    data = request.get_json()

    if not data or 'products' not in data:
        return jsonify({"error": "No products provided for comparison"}), 400

    products = data['products']

    if len(products) < 2:
        return jsonify({"error": "At least 2 products required for comparison"}), 400

    for product in products:
        mb_score, cb_score = calculate_mb_cb(product)
        product['mb_score'] = mb_score
        product['cb_score'] = cb_score
        product['total_score'] = mb_score + cb_score

    products.sort(key=lambda x: x.get('total_score', 0), reverse=True)

    return jsonify({
        "products": products,
        "best_value": products[0] if products else None
    }), 200

@api_bp.route('/api/history', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_history():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3001')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        origin = request.headers.get('Origin')
        if origin in ["http://localhost:3000", "http://localhost:3001"]:
            response.headers.add('Access-Control-Allow-Origin', origin)
        return response, 204

    current_user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    history = db.session.query(SearchHistory).filter(SearchHistory.user_id == current_user_id) \
                                .order_by(SearchHistory.timestamp.desc()) \
                                .paginate(page=page, per_page=per_page)

    return jsonify({
        "history": [item.to_dict() for item in history.items],
        "total": history.total,
        "pages": history.pages,
        "current_page": history.page
    }), 200
