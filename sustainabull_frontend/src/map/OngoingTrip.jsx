import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Hardcoded Coordinates for Testing
const startLocation = [49.2827, -123.1207]; 
const endLocation = [49.2645, -122.2711];   
const userPosition = [36.7783, -123.1867];   

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radius of Earth in meters
  const toRad = (x) => (x * Math.PI) / 180;

  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export default function OngoingTrip() {
  const navigate = useNavigate();
  const [distanceLeft, setDistanceLeft] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [route, setRoute] = useState(null);

  // Function to fetch the route from OpenRouteService API
  const fetchRoute = async () => {
    if (!startLocation || !endLocation) {
      console.error("Start or end location is missing");
      return;
    }
    // Correct way to construct the URL with template literals
    const url = `http://127.0.0.1:8000/api/routes/get-route/?start_lat=${startLocation[0]}&start_lng=${startLocation[1]}&end_lat=${endLocation[0]}&end_lng=${endLocation[1]}`;

    console.log("Fetching route with URL:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Failed to fetch route:", response.statusText);
        return;
      }

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

  // Fetch route when the component mounts or when startLocation or endLocation change
  useEffect(() => {
    if (startLocation && endLocation) {
      fetchRoute(); // Call the function to fetch the route
    }
  }, [startLocation, endLocation]); // Dependency on startLocation and endLocation

  // Simulate user position update (you could later replace this with real geolocation)
  useEffect(() => {
    if (!endLocation) return;

    const latitude = userPosition[0];
    const longitude = userPosition[1];
    
    // Calculate remaining distance
    const distance = getDistance(latitude, longitude, endLocation[0], endLocation[1]);
    setDistanceLeft(distance);

    // Check if user has arrived (threshold: 50 meters)
    if (distance < 50) {
      setArrived(true);
      setTimeout(() => {
        alert("You have arrived at your destination!");
        navigate('/home'); // Redirect after arrival
      }, 2000);
    }
  }, [endLocation]);

  // Handle "Abandon" trip action
  const handleAbandonTrip = () => {
    setShowWarning(true);
  };

  const confirmAbandon = () => {
    setShowWarning(false);
    alert("Trip abandoned. The cow will lose health.");
    navigate('/home'); // Redirect to home
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Ongoing Trip</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold">Start Destination</p>
            <p className="text-gray-600">{startLocation ? `${startLocation[0]}, ${startLocation[1]}` : "Loading..."}</p>
          </div>

          {/* MAP */}
          <div className="w-full h-64 relative">
            <MapContainer center={userPosition || startLocation || [51.505, -0.09]} zoom={13} className="h-full w-full z-10">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              {startLocation && (
                <Marker position={startLocation} icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png', iconSize: [25, 41], iconAnchor: [12, 41] })} />
              )}
              {endLocation && <Marker position={endLocation} />}
              {userPosition && <Marker position={userPosition} icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png', iconSize: [25, 41], iconAnchor: [12, 41] })} />}
              {route && (
                <Polyline positions={route} color="blue" />
              )}
            </MapContainer>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold">End Destination</p>
            <p className="text-gray-600">{endLocation ? `${endLocation[0]}, ${endLocation[1]}` : "Loading..."}</p>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold">{arrived ? "You have arrived!" : `${Math.round(distanceLeft)}m Left...`}</p>
          </div>
        </div>

        {/* Abandon Button */}
        <button onClick={handleAbandonTrip} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition w-full mt-4">
          Abandon Trip
        </button>
      </div>

      {/* Abandon Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-80">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-4">If you abandon the trip, the cow will lose health!</p>
            <div className="flex justify-around">
              <button onClick={() => setShowWarning(false)} className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition">
                Cancel
              </button>
              <button onClick={confirmAbandon} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
                Abandon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Home Button */}
      <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
        Home
      </Link>
    </div>
  );
}
