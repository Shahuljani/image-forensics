# backend/app.py
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import numpy as np
from PIL import Image, ImageChops, ExifTags, ImageEnhance
import cv2
import io
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet18
import torch.nn.functional as F
import imagehash

app = Flask(__name__)
CORS(app)

# ------------------ Analysis functions (kept logic) ------------------

def analyze_metadata_pil(img_pil):
    suspicious_fields = []
    try:
        exif_data = img_pil._getexif()
        if exif_data is None:
            suspicious_fields.append("No EXIF data (possible editing)")
            metadata_score = 0.4
        else:
            for tag, value in exif_data.items():
                tag_name = ExifTags.TAGS.get(tag, tag)
                if tag_name in ["Make", "Model"] and "Unknown" in str(value):
                    suspicious_fields.append(f"Suspicious {tag_name}: {value}")
                if tag_name in ["DateTimeOriginal", "DateTime"] and value is None:
                    suspicious_fields.append("Missing timestamp")
            metadata_score = 1.0 if len(suspicious_fields) == 0 else 0.6
    except Exception as e:
        metadata_score = 0.2
        suspicious_fields.append(f"Error reading EXIF: {e}")
    return metadata_score, suspicious_fields

def perform_ela(image, resave_quality=90):
    # image is PIL.Image
    try:
        temp_bytes = io.BytesIO()
        image.save(temp_bytes, "JPEG", quality=resave_quality)
        temp_bytes.seek(0)
        resaved = Image.open(temp_bytes)
        ela_image = ImageChops.difference(image, resaved)
        extrema = ela_image.getextrema()
        max_diff = max([ex[1] for ex in extrema]) if extrema else 0
        scale = 255.0 / max_diff if max_diff != 0 else 1
        ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)
        mean_diff = np.mean(np.array(ela_image))
        ela_score = float(min(1.0, mean_diff / 50.0))
        return ela_score, ela_image
    except Exception as e:
        return 0.2, None

def prnu_analysis(image):
    try:
        img_gray = np.array(image.convert("L"), dtype=np.float32)
        noise_residual = img_gray - cv2.GaussianBlur(img_gray, (3,3), 0)
        noise_score = float(min(np.std(noise_residual)/10.0, 1.0))
        return noise_score, "Noise residual heatmap generated"
    except Exception as e:
        return 0.2, f"Error in PRNU: {e}"

def gan_detection(image):
    try:
        model = resnet18(pretrained=True)
        model.eval()
        transform = transforms.Compose([
            transforms.Resize((224,224)),
            transforms.ToTensor()
        ])
        tensor = transform(image).unsqueeze(0)
        with torch.no_grad():
            output = model(tensor)
            prob = F.softmax(output, dim=1)[0][0].item()
            gan_score = float(1 - prob)
        return gan_score, "Pretrained ResNet18 used (placeholder)"
    except Exception as e:
        return 0.5, f"GAN detection error: {e}"

def visual_checks(image):
    try:
        img_np = np.array(image.convert("L"))
        mean, std = float(np.mean(img_np)), float(np.std(img_np))
        visual_score = float(min(1.0, std/80.0))
        return visual_score, "Std deviation indicates lighting/texture inconsistency"
    except Exception as e:
        return 0.4, f"Visual check error: {e}"

# ------------------ Flask endpoints ------------------

@app.route("/")
def hello():
    return jsonify({"status":"ok", "message":"Image forensics backend running"})

@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Expects multipart form-data with key 'image' (file).
    Returns JSON with scores and label.
    """
    if 'image' not in request.files:
        return jsonify({"error":"No image file provided"}), 400

    file = request.files['image']
    try:
        img_bytes = file.read()
        img_pil = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Unable to open image: {e}"}), 400

    # 1. Metadata
    metadata_score, metadata_issues = analyze_metadata_pil(img_pil)

    # 2. ELA
    ela_score, _ = perform_ela(img_pil)

    # 3. PRNU/noise
    noise_score, noise_reason = prnu_analysis(img_pil)

    # 4. GAN detection (placeholder)
    gan_score, gan_reason = gan_detection(img_pil)

    # 5. Visual checks
    visual_score, visual_reason = visual_checks(img_pil)

    scores = [metadata_score, ela_score, noise_score, gan_score, visual_score]
    ensemble_score = float(np.mean(scores))
    overall_label = "Fake/Synthetic" if ensemble_score > 0.5 else "Real"

    summary = [
        {"sector":"Metadata", "score":metadata_score, "reason":", ".join(metadata_issues) if metadata_issues else "OK"},
        {"sector":"ELA", "score":ela_score, "reason":"ELA diff analyzed"},
        {"sector":"Noise/PRNU", "score":noise_score, "reason":noise_reason},
        {"sector":"GAN Detection", "score":gan_score, "reason":gan_reason},
        {"sector":"Visual Checks", "score":visual_score, "reason":visual_reason}
    ]

    response = {
        "ensemble_score": ensemble_score,
        "overall_label": overall_label,
        "scores": summary
    }
    return jsonify(response), 200

if __name__ == "__main__":
    # Run on 0.0.0.0:5000 for hosting compatibility
    app.run(host="0.0.0.0", port=5000, debug=True)
