from fastapi import APIRouter
from auth.database import get_db

router = APIRouter()

@router.post("/login")
def login(data: dict):
    try:
        username = data.get("username")
        password = data.get("password")

        conn, cursor = get_db()

        cursor.execute(
            "SELECT * FROM users WHERE username=%s AND password=%s",
            (username, password)
        )

        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user:
            return {"token": "dummy_token", "message": "Login successful"}
        else:
            return {"error": "Invalid credentials"}

    except Exception as e:
        return {"error": str(e)}