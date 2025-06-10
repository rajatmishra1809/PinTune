from flask import Flask, render_template, request, jsonify
from datetime import datetime
from ytmusicapi import YTMusic
import re

app = Flask(__name__)
ytmusic = YTMusic()

@app.context_processor
def inject_now():
    return {'now': datetime.utcnow()}

# Simple mapping for Pinterest-like keywords to genres/moods
AESTHETIC_TO_QUERY = {
    'cozy': 'indie folk acoustic chill',
    'vintage': 'retro pop rock classics',
    'minimalist': 'ambient chill instrumental',
    'futuristic': 'edm synthwave electronic',
    'nature': 'nature sounds acoustic folk',
    'urban': 'hip hop rap rnb',
    'bohemian': 'indie folk chill',
    'dark academia': 'classical piano moody',
    'cottagecore': 'indie folk acoustic',
    'vibrant': 'pop upbeat dance',
    'calm': 'ambient chill lo-fi',
    'energetic': 'rock edm upbeat',
    'happy': 'pop happy upbeat',
    'sad': 'sad indie acoustic',
    'focused': 'study beats lo-fi',
    'romantic': 'love songs pop rnb',
    # Add more as needed
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/recommend_music', methods=['POST'])
def recommend_music():
    data = request.get_json()
    description = data.get('description', '').lower().strip()
    # Extract keywords from description
    query = ''
    for key, val in AESTHETIC_TO_QUERY.items():
        if key in description:
            query = val
            break
    if not query:
        query = description if description else "trending music"

    # Search YouTube Music
    results = ytmusic.search(query, filter='songs')
    songs = []
    for item in results[:10]:
        songs.append({
            'title': item['title'],
            'artist': item['artists'][0]['name'] if item.get('artists') else "Unknown",
            'album_art': item['thumbnails'][-1]['url'] if item.get('thumbnails') else None,
            'preview_url': None,
            'youtube_url': f"https://music.youtube.com/watch?v={item['videoId']}" if 'videoId' in item else None
        })
    return jsonify({'songs': songs})

@app.route('/register_profile', methods=['POST'])
def register_profile():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    if not name or not email:
        return jsonify({'error': 'Name and email are required.'}), 400
    return jsonify({'message': 'Registration successful! Welcome to PinTune.'}), 200

if __name__ == '__main__':
    app.run(debug=True)
