from flask import Blueprint
from flask_socketio import emit, join_room, leave_room
from datetime import datetime, timezone

chat_bp = Blueprint('chat', __name__)

# In-memory database (swap to proper DB for persistence)
room_messages = {}

def register_chat_events(socketio):
    @socketio.on('join_room')
    def handle_join(data):
        room = data.get('room_id')
        username = data.get('username', 'Guest')
        if not room:
            print("Join failed: no room_id provided")
            return
            
        join_room(room)
        room_messages.setdefault(room, [])
        
        print(f"User '{username}' joined room '{room}'")
        
        # Send room history back to the joiner
        emit('room_history', room_messages[room], to=room)
        # Notify other room members
        emit('user_joined', {'username': username}, to=room)

    @socketio.on('send_message')
    def handle_message(data):
        room = data.get('room_id')
        if not room:
            print("Message send failed: no room_id provided")
            return
            
        sender = data.get('sender', 'Anonymous')
        text = data.get('text', '')
        image = data.get('image', None) # Support base64 image strings!
        
        msg = {
            'id': datetime.now(timezone.utc).timestamp() * 1000,
            'sender': sender,
            'text': text,
            'image': image,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        # Save to store
        room_messages.setdefault(room, [])
        room_messages[room].append(msg)
        
        print(f"[{room}] Message from {sender}: {text[:30]}...")
        
        # Broadcast message to everyone in the room
        emit('receive_message', msg, to=room)

    @socketio.on('leave_room')
    def handle_leave(data):
        room = data.get('room_id')
        if room:
            leave_room(room)
            print(f"Left room '{room}'")
