from flask import Flask, request, jsonify
import cv2
import numpy as np
import requests
import io
from PIL import Image
from tensorflow.keras.models import load_model
from flask_cors import CORS
app = Flask(__name__)
CORS(app)



# Emotion labels
emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Load the emotion detection model
try:
    print("📦 Loading model...")
    model = load_model("model_weights.h5")
    print("✅ Model loaded successfully.")
except Exception as e:
    print("❌ Failed to load model:", e)
    model = None

# Load Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

# Root route to test if Flask is running
@app.route('/', methods=['GET'])
def home():
    return "✅ Flask Emotion Detection API is running!"

# Emotion prediction endpoint
@app.route('/predict', methods=['POST'])
def predict_emotion():
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500

    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'No image URL provided'}), 400

    try:
        print(f"🌐 Downloading image from: {data['url']}")
        response = requests.get(data['url'])
        image = Image.open(io.BytesIO(response.content)).convert("RGB")
        frame = np.array(image)
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(48, 48))

        if len(faces) == 0:
            print("😐 No face detected.")
            return jsonify({'message': 'No faces detected', 'url': data['url']}), 200

        results = []
        for (x, y, w, h) in faces:
            face_img = gray[y:y + h, x:x + w]
            face_resized = cv2.resize(face_img, (48, 48)).astype('float32') / 255.0
            face_input = np.expand_dims(face_resized, axis=(0, -1))  # Shape: (1, 48, 48, 1)

            preds = model.predict(face_input)
            idx = np.argmax(preds[0])
            label = emotions[idx]
            conf = float(preds[0][idx])

            print(f"✅ Detected emotion: {label} ({conf:.2f})")
            results.append({
                'expression': label,
                'confidence': conf,
                'bounding_box': [int(x), int(y), int(w), int(h)]
            })

        return jsonify({
            'url': data['url'],
            'num_faces': len(results),
            'results': results
        })

    except Exception as e:
        print("❌ Error in prediction:", str(e))
        return jsonify({'error': str(e)}), 500

# Run the Flask server
if __name__ == '__main__':
    # Only for local debugging
    app.run(host='0.0.0.0', port=10000, debug=True)

