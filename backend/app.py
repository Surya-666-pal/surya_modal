# 1. Monkey patch first for eventlet compatibility
import eventlet
eventlet.monkey_patch()

import os
import json
import requests
from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from chat import chat_bp, register_chat_events

app = Flask(__name__)

# Allow localhost in dev, custom domain in prod
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://localhost:3003",
    "http://127.0.0.1:3003"
]

CORS(app, origins=allowed_origins)

# Instantiate Socket.IO with CORS settings and full logging enabled
socketio = SocketIO(
    app, 
    cors_allowed_origins="*", # Allow all origins for local testing convenience
    transports=['websocket', 'polling'], # Allow fallback polling
    logger=True,
    engineio_logger=True
)

# Register events and blueprint
register_chat_events(socketio)
app.register_blueprint(chat_bp)

GEMINI_API_KEY = os.getenv("VITE_GEMINI_API_KEY")

SYSTEM_PROMPT = """You are "Bharat AI Architect", a friendly and expert AI trip planner for the Bharat Yatra app — a premium heritage and culture travel platform for India.
You help users plan journeys, compare stays in budget, explore dining spots, and discover historic landmarks.

Response Guidelines:
1. PLANNING: If asked for travel planning or itineraries, generate a day-by-day tour guide path.
2. ROOMS / STAYS: If asked about rooms, accommodation, or hotels, make sure to check/resolve "How many sharing?" (1, 2, 3+ sharing) and budget limits. Trigger the compare_stays_in_budget tool using sharing count and any specified booking sites (Booking.com, MakeMyTrip, OYO).
3. FOOD / RESTAURANTS: If asked about dining, food trails, or restaurants, trigger the get_food_and_restaurants tool.
4. SPECIFIC LANDMARKS: If asked about a specific monument or place, trigger the get_specific_place_info tool.

Always return a helpful conversational reply explaining the tool results naturally.
"""

def load_stays_data():
    try:
        path = os.path.join(os.path.dirname(__file__), 'stays_data.json')
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print("Error loading stays_data.json:", e)
        return []

def load_restaurant_data():
    try:
        path = os.path.join(os.path.dirname(__file__), 'restaurant_data.json')
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print("Error loading restaurant_data.json:", e)
        return []

def compare_stays_in_budget(destination, budget_per_night, days, sharing_count=2, booking_app=None):
    stays = load_stays_data()
    filtered = []
    dest_lower = destination.lower().strip()
    app_lower = booking_app.lower().strip() if booking_app else None
    
    for s in stays:
        if dest_lower not in s.get('destination', '').lower():
            continue
        if app_lower and app_lower not in s.get('source', '').lower():
            continue
            
        base_price = s.get('price_per_night', 0)
        sharing = int(sharing_count or 2)
        
        if sharing == 1:
            adjusted_price = int(base_price * 0.90)
        elif sharing == 2:
            adjusted_price = base_price
        elif sharing == 3:
            adjusted_price = int(base_price * 1.30)
        else:
            adjusted_price = int(base_price * (1.0 + (sharing - 2) * 0.20))
            
        price_per_person = int(adjusted_price / sharing)
        
        if adjusted_price <= budget_per_night:
            stay_copy = dict(s)
            stay_copy['price_per_night'] = adjusted_price
            stay_copy['price_per_person'] = price_per_person
            stay_copy['sharing'] = sharing
            filtered.append(stay_copy)
            
    filtered.sort(key=lambda x: x.get('price_per_night', 0))
    return filtered

def get_food_and_restaurants(destination, food_type=None):
    res_list = load_restaurant_data()
    filtered = []
    dest_lower = destination.lower().strip()
    food_lower = food_type.lower().strip() if food_type else None
    
    for r in res_list:
        if dest_lower in r.get('destination', '').lower():
            if food_lower:
                if (food_lower in r.get('cuisine', '').lower() or 
                    food_lower in r.get('specialty', '').lower()):
                    filtered.append(r)
            else:
                filtered.append(r)
    return filtered

def get_specific_place_info(place_name):
    places_info = {
        "hawa mahal": {
            "name": "Hawa Mahal (Palace of Winds)",
            "destination": "Jaipur",
            "timings": "9:00 AM - 5:00 PM daily",
            "entry_fee": "₹50 for Indians, ₹200 for foreigners",
            "description": "Built in 1799 by Maharaja Sawai Pratap Singh, this five-story palace features 953 small casements (jharokhas) designed to allow royal women to observe street life without being seen.",
            "tips": "Visit early in the morning when the sun lights up the golden pink facade, and try the rooftop cafes opposite it for the best photo view!"
        },
        "amber fort": {
            "name": "Amber Fort (Amer Fort)",
            "destination": "Jaipur",
            "timings": "8:00 AM - 5:30 PM, Evening Show 6:30 PM",
            "entry_fee": "₹100 for Indians, ₹500 for foreigners",
            "description": "A magnificent fort located in Amer town, famous for its artistic Hindu style elements, overlooking Maota Lake.",
            "tips": "Hire a registered guide to hear stories of Sheesh Mahal (Mirror Palace) and catch the spectacular Sound & Light show in the evening."
        },
        "kashi vishwanath": {
            "name": "Kashi Vishwanath Temple",
            "destination": "Varanasi",
            "timings": "3:00 AM - 11:00 PM",
            "entry_fee": "Free entry, VIP Darshan ₹300",
            "description": "One of the most famous Hindu temples dedicated to Lord Shiva, located on the western bank of the holy river Ganges.",
            "tips": "Avoid carrying mobile phones or electronic gadgets as they are strictly prohibited inside. Go early morning for shorter queue lines."
        },
        "baga beach": {
            "name": "Baga Beach",
            "destination": "Goa",
            "timings": "24/7 accessible",
            "entry_fee": "Free",
            "description": "A popular beach in North Goa known for its active nightlife, beach shacks, water sports, and dolphin cruises.",
            "tips": "Try parasailing and jet-skiing in the morning, and enjoy fresh seafood at Britto's shack during sunset."
        }
    }
    
    q = place_name.lower().strip()
    for k, v in places_info.items():
        if k in q:
            return v
            
    return {
        "name": place_name,
        "description": "A historic and culturally rich destination in India. Best explored with local guides.",
        "tips": "Ensure to check local weather forecasts and wear comfortable walking shoes."
    }

@app.route('/api/chat', methods=['POST'])
def chat_api_endpoint():
    data = request.json or {}
    history = data.get('history', [])
    message = data.get('message', '')
    
    contents = []
    for h in history:
        role = 'model' if h.get('role') == 'model' else 'user'
        contents.append({
            "role": role,
            "parts": [{"text": h.get('text', '')}]
        })
        
    contents.append({
        "role": "user",
        "parts": [{"text": message}]
    })
    
    tools = [{
        "functionDeclarations": [
            {
                "name": "compare_stays_in_budget",
                "description": "Compare hotel and accommodation stay options for a destination, filtering by budget, booking site, and sharing occupancies.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "destination": {
                            "type": "STRING",
                            "description": "The destination city, e.g. Jaipur, Varanasi, Goa, Kerala, Ladakh"
                        },
                        "budget_per_night": {
                            "type": "NUMBER",
                            "description": "The maximum nightly price for stays in INR"
                        },
                        "days": {
                            "type": "INTEGER",
                            "description": "Trip duration in days"
                        },
                        "sharing_count": {
                            "type": "INTEGER",
                            "description": "Number of occupants sharing the room (1, 2, 3, etc.)"
                        },
                        "booking_app": {
                            "type": "STRING",
                            "description": "Specific booking app filter, e.g. Booking.com, MakeMyTrip, OYO"
                        }
                    },
                    "required": ["destination", "budget_per_night", "days"]
                }
            },
            {
                "name": "get_food_and_restaurants",
                "description": "Retrieve recommended restaurants, dining places, and food spots for a destination.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "destination": {
                            "type": "STRING",
                            "description": "The destination city, e.g. Jaipur, Varanasi, Goa"
                        },
                        "food_type": {
                            "type": "STRING",
                            "description": "Preferred food style, e.g. vegetarian, seafood, tea, cafe, street food"
                        }
                    },
                    "required": ["destination"]
                }
            },
            {
                "name": "get_specific_place_info",
                "description": "Retrieve timings, entry fee, description, and travel tips for a specific landmark monument or attraction.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "place_name": {
                            "type": "STRING",
                            "description": "The name of the tourist attraction or monument, e.g. Hawa Mahal, Amber Fort, Kashi Vishwanath"
                        }
                    },
                    "required": ["place_name"]
                }
            }
        ]
    }]
    
    payload = {
        "contents": contents,
        "systemInstruction": {
            "parts": [{"text": SYSTEM_PROMPT}]
        },
        "tools": tools,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 2048
        }
    }
    
    try:
        model = "gemini-2.0-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
        res = requests.post(url, json=payload, timeout=20)
        
        if not res.ok:
            return jsonify({
                "reply": "I'm having a little trouble connecting to my travel nodes. Let me know what information you need!",
                "type": "chat"
            }), 200
            
        res_data = res.json()
        candidate = res_data.get('candidates', [{}])[0]
        content = candidate.get('content', {})
        parts = content.get('parts', [])
        
        function_call = None
        for p in parts:
            if 'functionCall' in p:
                function_call = p['functionCall']
                break
                
        if function_call:
            tool_name = function_call.get('name')
            args = function_call.get('args', {})
            
            tool_response = {}
            response_type = "chat"
            client_data = None
            
            if tool_name == 'compare_stays_in_budget':
                dest = args.get('destination', 'Jaipur')
                budget = args.get('budget_per_night', 5000)
                days = args.get('days', 3)
                sharing = args.get('sharing_count', 2)
                app_filter = args.get('booking_app', None)
                
                stays_result = compare_stays_in_budget(dest, budget, days, sharing, app_filter)
                tool_response = {"stays": stays_result}
                response_type = "stay_comparison"
                client_data = stays_result
                
            elif tool_name == 'get_food_and_restaurants':
                dest = args.get('destination', 'Jaipur')
                food_type = args.get('food_type', None)
                
                restaurants_result = get_food_and_restaurants(dest, food_type)
                tool_response = {"restaurants": restaurants_result}
                response_type = "restaurant_recommendation"
                client_data = restaurants_result
                
            elif tool_name == 'get_specific_place_info':
                place = args.get('place_name', 'Hawa Mahal')
                
                place_result = get_specific_place_info(place)
                tool_response = {"place_info": place_result}
                response_type = "place_info"
                client_data = place_result
                
            # Second turn call
            contents.append({
                "role": "model",
                "parts": [{"functionCall": function_call}]
            })
            contents.append({
                "role": "user",
                "parts": [{
                    "functionResponse": {
                        "name": tool_name,
                        "response": tool_response
                    }
                }]
            })
            
            second_payload = {
                "contents": contents,
                "systemInstruction": {
                    "parts": [{"text": SYSTEM_PROMPT}]
                },
                "tools": tools,
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 2048
                }
            }
            
            res2 = requests.post(url, json=second_payload, timeout=20)
            if res2.ok:
                res2_data = res2.json()
                candidate2 = res2_data.get('candidates', [{}])[0]
                text_reply = candidate2.get('content', {}).get('parts', [{}])[0].get('text', '')
                
                return jsonify({
                    "reply": text_reply,
                    "type": response_type,
                    "data": client_data
                }), 200
                
        text_reply = parts[0].get('text', '') if parts else "Let me know how I can help you plan your travel!"
        return jsonify({
            "reply": text_reply,
            "type": "chat"
        }), 200
        
    except Exception as e:
        print("Chat API Error:", e)
        return jsonify({
            "reply": "Error connecting to AI service. Let me know if you want to proceed with standard route mapping!",
            "type": "chat"
        }), 200

from datetime import datetime, timedelta

def load_trips_data():
    try:
        path = os.path.join(os.path.dirname(__file__), 'trips_data.json')
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print("Error loading trips_data.json:", e)
        return []

@app.route('/api/trips/match', methods=['GET'])
def match_trips_api():
    destination = request.args.get('destination', '').lower().strip()
    date_str = request.args.get('date', '').strip()
    
    trips = load_trips_data()
    matched_trips = []
    
    if not destination or not date_str:
        return jsonify({"trips": [], "message": "Destination and date params are required."}), 200
        
    try:
        query_date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        try:
            # Parse JavaScript ISO string formats
            query_date = datetime.strptime(date_str.split('T')[0], "%Y-%m-%d")
        except Exception:
            return jsonify({"trips": [], "message": "Invalid date format. Expected YYYY-MM-DD."}), 200
            
    for t in trips:
        if destination not in t.get('destination', '').lower():
            continue
            
        try:
            trip_start = datetime.strptime(t.get('start_date', ''), "%Y-%m-%d")
        except ValueError:
            continue
            
        diff = abs((trip_start - query_date).days)
        if diff <= 3:
            matched_trips.append(t)
            
    return jsonify({"trips": matched_trips}), 200

@app.route('/api/trips/upcoming', methods=['GET'])
def upcoming_trips_api():
    destination = request.args.get('destination', '').lower().strip()
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    
    trips = load_trips_data()
    filtered = []
    
    for t in trips:
        if destination and destination not in t.get('destination', '').lower():
            continue
            
        price = t.get('price', 0)
        if min_price:
            try:
                if price < float(min_price):
                    continue
            except ValueError:
                pass
        if max_price:
            try:
                if price > float(max_price):
                    continue
            except ValueError:
                pass
                
        if date_from or date_to:
            try:
                trip_start = datetime.strptime(t.get('start_date', ''), "%Y-%m-%d")
                if date_from:
                    from_dt = datetime.strptime(date_from, "%Y-%m-%d")
                    if trip_start < from_dt:
                        continue
                if date_to:
                    to_dt = datetime.strptime(date_to, "%Y-%m-%d")
                    if trip_start > to_dt:
                        continue
            except ValueError:
                continue
                
        filtered.append(t)
        
    filtered.sort(key=lambda x: x.get('start_date', ''))
    return jsonify({"trips": filtered}), 200


def load_sharing_requests():
    try:
        path = os.path.join(os.path.dirname(__file__), 'sharing_requests.json')
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print("Error loading sharing_requests.json:", e)
        return []

def save_sharing_requests(data):
    try:
        path = os.path.join(os.path.dirname(__file__), 'sharing_requests.json')
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print("Error saving sharing_requests.json:", e)
        return False

@app.route('/api/booking/sharing/request', methods=['POST'])
def create_sharing_request():
    data = request.json or {}
    user_name = data.get('user_name', 'Guest')
    user_gender = data.get('user_gender', 'male').lower()
    city = data.get('city', '').strip()
    area = data.get('area', '').strip()
    checkin = data.get('checkin', '')
    checkout = data.get('checkout', '')
    budget = float(data.get('budget', 0))
    stay_type = data.get('stay_type', 'Hostel')
    gender_pref = data.get('gender_pref', 'any').lower()
    verified = data.get('verified', True)
    
    if not city or not checkin or not checkout or budget <= 0:
        return jsonify({"message": "City, check-in, check-out, and budget are required."}), 200
        
    requests_list = load_sharing_requests()
    
    new_id = f"REQ-{len(requests_list) + 201}"
    user_id = f"USER-{len(requests_list) + 901}"
    
    new_req = {
        "id": new_id,
        "user_id": user_id,
        "user_name": user_name,
        "user_gender": user_gender,
        "city": city,
        "area": area,
        "checkin": checkin,
        "checkout": checkout,
        "budget": budget,
        "stay_type": stay_type,
        "gender_pref": gender_pref,
        "verified": verified,
        "status": "open"
    }
    
    matches = []
    
    try:
        a_in = datetime.strptime(checkin.split('T')[0], "%Y-%m-%d")
        a_out = datetime.strptime(checkout.split('T')[0], "%Y-%m-%d")
    except ValueError:
        return jsonify({"message": "Invalid date format. Expected YYYY-MM-DD."}), 200
        
    for r in requests_list:
        if r.get('status') != 'open':
            continue
        
        if city.lower() not in r.get('city', '').lower() and r.get('city', '').lower() not in city.lower():
            continue
            
        try:
            b_in = datetime.strptime(r.get('checkin'), "%Y-%m-%d")
            b_out = datetime.strptime(r.get('checkout'), "%Y-%m-%d")
        except ValueError:
            continue
            
        overlap_start = max(a_in, b_in)
        overlap_end = min(a_out, b_out)
        if overlap_start > overlap_end:
            continue
            
        b_budget = float(r.get('budget', 0))
        if b_budget <= 0:
            continue
        pct_diff = abs(budget - b_budget) / budget
        if pct_diff > 0.20:
            continue
            
        r_gender = r.get('user_gender', '').lower()
        if gender_pref == 'same-gender' and user_gender != r_gender:
            continue
        r_pref = r.get('gender_pref', '').lower()
        if r_pref == 'same-gender' and r_gender != user_gender:
            continue
            
        matches.append(r)
        
    requests_list.append(new_req)
    save_sharing_requests(requests_list)
    
    return jsonify({
        "request": new_req,
        "matches": matches,
        "message": "Request saved successfully."
    }), 200

@app.route('/api/booking/sharing/matches/<user_id>', methods=['GET'])
def get_sharing_matches(user_id):
    requests_list = load_sharing_requests()
    user_req = None
    for r in requests_list:
        if r.get('user_id') == user_id or r.get('id') == user_id:
            user_req = r
            break
            
    if not user_req:
        return jsonify({"matches": [], "message": "Request not found."}), 200
        
    city = user_req.get('city')
    checkin = user_req.get('checkin')
    checkout = user_req.get('checkout')
    budget = float(user_req.get('budget', 0))
    user_gender = user_req.get('user_gender', '').lower()
    gender_pref = user_req.get('gender_pref', 'any').lower()
    
    matches = []
    try:
        a_in = datetime.strptime(checkin, "%Y-%m-%d")
        a_out = datetime.strptime(checkout, "%Y-%m-%d")
    except ValueError:
        return jsonify({"matches": []}), 200
        
    for r in requests_list:
        if r.get('id') == user_req.get('id') or r.get('status') != 'open':
            continue
            
        if city.lower() not in r.get('city', '').lower() and r.get('city', '').lower() not in city.lower():
            continue
            
        try:
            b_in = datetime.strptime(r.get('checkin'), "%Y-%m-%d")
            b_out = datetime.strptime(r.get('checkout'), "%Y-%m-%d")
        except ValueError:
            continue
            
        overlap_start = max(a_in, b_in)
        overlap_end = min(a_out, b_out)
        if overlap_start > overlap_end:
            continue
            
        b_budget = float(r.get('budget', 0))
        pct_diff = abs(budget - b_budget) / budget
        if pct_diff > 0.20:
            continue
            
        r_gender = r.get('user_gender', '').lower()
        if gender_pref == 'same-gender' and user_gender != r_gender:
            continue
        r_pref = r.get('gender_pref', '').lower()
        if r_pref == 'same-gender' and r_gender != user_gender:
            continue
            
        matches.append(r)
        
    return jsonify({"matches": matches}), 200

@app.route('/api/booking/sharing/split', methods=['POST'])
def split_sharing_cost():
    data = request.json or {}
    total_amount = float(data.get('total_amount', 0))
    num_people = int(data.get('num_people', 2))
    
    if total_amount <= 0 or num_people <= 0:
        return jsonify({"message": "Invalid split parameters"}), 200
        
    share = round(total_amount / num_people, 2)
    return jsonify({
        "total_amount": total_amount,
        "num_people": num_people,
        "per_person_share": share
    }), 200



@app.route('/health')
def health_check():
    return {"status": "ok", "service": "Flask-SocketIO Chat Service"}, 200

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    print("SocketIO server running on port 5000")
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
