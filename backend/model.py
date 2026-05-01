import cv2
import os
import requests

# 🔑 Replace with your actual values
ROBOFLOW_API_KEY = "kLD80em8TvyimzzJiVxv"
ROBOFLOW_PROJECT_ID = "pothole-detection-yolov8"
ROBOFLOW_VERSION = "1"


def predict_pothole(image_path):
    # Load image
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Image could not be loaded")

    output_img = img.copy()

    # 🔥 Roboflow API endpoint
    inference_url = f"https://detect.roboflow.com/{ROBOFLOW_PROJECT_ID}/{ROBOFLOW_VERSION}"

    # Send request
    try:
        with open(image_path, "rb") as f:
            response = requests.post(
                inference_url,
                files={"file": f},
                params={"api_key": ROBOFLOW_API_KEY},
                timeout=30
            )

        response.raise_for_status()
        result = response.json()

    except Exception as e:
        print(f"Roboflow API error: {e}")

        # fallback mock response (prevents crash)
        result = {
            "predictions": []
        }

    pothole_count = 0
    confidences = []

    # Process predictions
    for pred in result.get("predictions", []):
        x = int(pred["x"])
        y = int(pred["y"])
        w = int(pred["width"])
        h = int(pred["height"])
        conf = pred["confidence"]

        x1 = int(x - w / 2)
        y1 = int(y - h / 2)
        x2 = int(x + w / 2)
        y2 = int(y + h / 2)

        # Draw bounding box
        cv2.rectangle(output_img, (x1, y1), (x2, y2), (0, 255, 0), 2)

        # Confidence text
        cv2.putText(
            output_img,
            f"{conf:.2f}",
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (0, 255, 0),
            2
        )

        pothole_count += 1
        confidences.append(conf)

    # Ensure output directory exists
    output_dir = os.path.join("uploads", "output")
    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(output_dir, os.path.basename(image_path))
    cv2.imwrite(output_path, output_img)

    avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
    result_label = "pothole" if pothole_count > 0 else "no pothole"

    return result_label, avg_conf, pothole_count, output_path