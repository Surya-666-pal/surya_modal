# 1. Monkey patch first for eventlet compatibility
import eventlet
eventlet.monkey_patch()

import os
from flask import Flask
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

@app.route('/health')
def health_check():
    return {"status": "ok", "service": "Flask-SocketIO Chat Service"}, 200

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    print("SocketIO server running on port 5000")
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
