import os
import requests
from dotenv import load_dotenv

load_dotenv()

ORS_API_KEY = os.getenv("ORS_API_KEY")
ORS_URL = "https://api.openrouteservice.org/v2/directions/driving-car"

if not ORS_API_KEY:
    raise ValueError("Missing OpenRouteService API Key! Set ORS_API_KEY in the .env file.")

def get_route_from_ors(start_lat, start_lng, end_lat, end_lng):
    """Fetches a route from OpenRouteService API."""
    start = [float(start_lng), float(start_lat)]  # ORS expects "longitude,latitude"
    end = [float(end_lng), float(end_lat)]

    request_body = {"coordinates": [start, end]}

    headers = {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
    }

    response = requests.post(ORS_URL, json=request_body, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.json(), "status": response.status_code}
