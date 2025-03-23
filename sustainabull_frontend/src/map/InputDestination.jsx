import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import OpenRouteService from 'openrouteservice-js';

export default function InputDestination() {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const[userPosition, setUserPosition] = useState(null);

  // get user's current location with Geolocation API
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } =  position.coords;
        setUserPosition([latitude, longitude]);
        setStartLocation([latitude, longitude]); // Default start location
      },
      (error) => console.error("Error getting location: ", error),
      { enableHighAccuracy: true }
    );
  }, []);

  // fetch route using OpenRouteService API
  const fetchRoute = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/routes/get-route/?start_lat=${start.lat}&start_lng=${start.lng}&end_lat=${end.lat}&end_lng=${end.lng}`
      );
  
      const data = await response.json();
  
      if (data.features) {
        const coordinates = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(coordinates);
      } else {
        console.error("No route found:", data);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };
  
 

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Input Destination</h1>
     
     {/* Input Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Start Destination"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="End Destination"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Map */}
        <div className="mt-6 w-full h-64">
        <MapContainer center={userPosition || [51.505, -0.09]} zoom={13} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {startLocation && <Marker position={startLocation} icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png', iconSize: [25, 41], iconAnchor: [12, 41] })} />}
            {endLocation && <Marker position={endLocation} />}
            {route.length > 0 && <Polyline positions={route} color="blue" />}
          </MapContainer>
        </div>

        <div className="mt-6 flex justify-between">
            <Link to="/transportation-mode" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Back
            </Link>
            <Link to="/ongoing-trip" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Finish
                {/* We should add a warning to the user that when they click this button, they cannot go back.
                    This is because the cow will lose health if the user abandons trips.
                */}
            </Link>
        </div>
      </div>
        <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
            Home
        </Link>
    </div>
  );
}