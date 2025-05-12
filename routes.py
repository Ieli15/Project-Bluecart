from flask import request, jsonify
from app import app
from models import db, User, SearchHistory, Product
from flask_jwt_extended import jwt_required, get_jwt_identity
from analysis import calculate_mb_cb

# Home route
@app.route('/')
def home():
    return jsonify({"message": "ShopCrawl API is running"}), 200

# User Profile
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.to_dict()), 200

# Update profile
@app.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    
    if 'username' in data:
        # Check if username is already taken
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user and existing_user.id != current_user_id:
            return jsonify({"error": "Username already taken"}), 400
        user.username = data['username']
    
    if 'email' in data:
        # Check if email is already taken
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != current_user_id:
            return jsonify({"error": "Email already taken"}), 400
        user.email = data['email']
    
    if 'password' in data:
        user.set_password(data['password'])
    
    db.session.commit()
    
    return jsonify({"message": "Profile updated successfully"}), 200

# Get specific search result
@app.route('/api/history/<int:search_id>', methods=['GET'])
@jwt_required()
def get_search_result(search_id):
    current_user_id = get_jwt_identity()
    
    search = SearchHistory.query.filter_by(id=search_id, user_id=current_user_id).first()
    
    if not search:
        return jsonify({"error": "Search not found"}), 404
    
    return jsonify(search.to_dict()), 200

# Delete search history item
@app.route('/api/history/<int:search_id>', methods=['DELETE'])
@jwt_required()
def delete_search_result(search_id):
    current_user_id = get_jwt_identity()
    
    search = SearchHistory.query.filter_by(id=search_id, user_id=current_user_id).first()
    
    if not search:
        return jsonify({"error": "Search not found"}), 404
    
    db.session.delete(search)
    db.session.commit()
    
    return jsonify({"message": "Search history item deleted"}), 200
