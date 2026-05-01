from roboflow import Roboflow
import cv2
import os

# Load model
rf = Roboflow(api_key="kLD80em8TvyimzzJiVxv")
project = rf.workspace().project("pothole-detection-yolov8")
model = project.version(1).model


def predict_pothole(image_path):
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Image could not be loaded")

    output_img = img.copy()

    result = model.predict(image_path, confidence=40, overlap=30).json()

    pothole_count = 0
    confidences = []

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

        cv2.rectangle(output_img, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(output_img, f"{conf:.2f}", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

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