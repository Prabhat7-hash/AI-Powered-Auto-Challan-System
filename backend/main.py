from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from auth.routes import router as auth_router
from auth.database import get_db
from ai_model import detect_objects
# from fastapi.responses import FileResponse
import cv2
from ai_model import detect_objects, draw_boxes
import base64
import cv2
app = FastAPI()

# ✅ CORS (Frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Auth routes
app.include_router(auth_router, prefix="/auth")


# ✅ Home route
@app.get("/")
def home():
    return {"message": "API running"}


# ✅ Get vehicles from DB
@app.get("/vehicles")
def get_vehicles():
    try:
        conn, cursor = get_db()

        cursor.execute("SELECT * FROM Vehicle")
        vehicles = cursor.fetchall()

        cursor.close()
        conn.close()

        return vehicles

    except Exception as e:
        return {"error": str(e)}


# ✅ Get violations (can upgrade later)
@app.get("/violation/{violation_id}")
def get_violation(violation_id: int):
    try:
        conn, cursor = get_db()

        cursor.execute(
            "SELECT * FROM Violation WHERE ViolationID = %s",
            (violation_id,)
        )

        violation = cursor.fetchone()   # ✅ IMPORTANT

        cursor.close()
        conn.close()

        if not violation:
            return {"error": "Violation not found"}

        return violation

    except Exception as e:
        return {"error": str(e)}

# ✅ Dashboard route
@app.get("/dashboard")
def dashboard():
    return {"message": "Dashboard data"}


# ✅ Profile route
@app.get("/profile")
def get_profile():
    return {
        "username": "admin",
        "role": "admin",
        "email": "admin@example.com"
    }






@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        detections, img = detect_objects(contents)

        # 🔥 Draw bounding boxes
        img = draw_boxes(img, detections)

        # 🔥 Convert to base64
        _, buffer = cv2.imencode(".jpg", img)
        img_base64 = base64.b64encode(buffer).decode("utf-8")

        return {
            "detections": detections,
            "image": img_base64
        }

    except Exception as e:
        return {"error": str(e)}
    


@app.post("/register-vehicle")
def register_vehicle(data: dict):
    try:
        owner = data.get("ownerName")
        plate = data.get("licensePlate")
        vehicle_type = data.get("vehicleType")

        conn, cursor = get_db()

        cursor.execute("""
        INSERT INTO Vehicle (OwnerName, LicensePlate, VehicleType)
        VALUES (%s, %s, %s)
        """, (owner, plate, vehicle_type))

        conn.commit()

        cursor.close()
        conn.close()

        return {"message": "Vehicle registered successfully"}

    except Exception as e:
        return {"error": str(e)}
    

@app.post("/add-violation")
def add_violation(data: dict):
    try:
        license_plate = data.get("licensePlate")
        violation_type = data.get("violationType")
        fine = data.get("fineAmount")
        location = data.get("location")

        conn, cursor = get_db()

        # 🔥 Get VehicleID from license plate
        cursor.execute(
            "SELECT VehicleID FROM Vehicle WHERE LicensePlate=%s",
            (license_plate,)
        )
        vehicle = cursor.fetchone()

        if not vehicle:
            return {"error": "Vehicle not found"}

        vehicle_id = vehicle["VehicleID"]

        # 🔥 Insert violation
        cursor.execute("""
        INSERT INTO Violation (VehicleID, ViolationType, FineAmount)
        VALUES (%s, %s, %s)
        """, (vehicle_id, violation_type, fine))

        conn.commit()

        cursor.close()
        conn.close()

        return {"message": "Violation added successfully"}

    except Exception as e:
        return {"error": str(e)}


@app.delete("/delete-vehicle/{plate}")
def delete_vehicle(plate: str):
    try:
        conn, cursor = get_db()

        cursor.execute(
            "DELETE FROM Vehicle WHERE LicensePlate=%s",
            (plate,)
        )

        conn.commit()

        cursor.close()
        conn.close()

        return {"message": "Vehicle deleted successfully"}

    except Exception as e:
        return {"error": str(e)}