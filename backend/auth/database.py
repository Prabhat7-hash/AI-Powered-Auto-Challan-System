import mysql.connector

def get_db():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="trafficdb"
    )

    cursor = conn.cursor(dictionary=True)
    return conn, cursor