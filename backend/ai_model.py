from ultralytics import YOLO
import cv2
import numpy as np

# ✅ Load model once
model = YOLO("yolov8n.pt")

vehicle_labels = {
    2: "car",
    3: "bike",
    5: "bus",
    7: "truck"
}

def detect_objects(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model(img)

    detections = []
    for r in results:
        for box in r.boxes.data.tolist():
            cls = int(box[5])

            detections.append({
                "type": cls,
                "confidence": box[4],
                "bbox": box[:4]
            })

    return detections, img   # 🔥 VERY IMPORTANT

def draw_boxes(img, detections):
    for d in detections:
        x1, y1, x2, y2 = map(int, d["bbox"])
        label = d["type"]

        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(img, str(label), (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    return img