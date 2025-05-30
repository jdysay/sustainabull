import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import polyline from 'polyline';


export default function OngoingTrip() {
  const navigate = useNavigate();
  const [distanceLeft, setDistanceLeft] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [route, setRoute] = useState(null);
  const location = useLocation();
  const [totalDistance, setTotalDistance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startAddress, setStartAddress] = useState("Loading...");
  const[endAddress, setEndAddress] = useState("Loading...");
  

  const { startLocation = [0, 0], endLocation = [0, 0] } = location.state || {};
  const [userPosition, setUserPosition] = useState(null);

  // test coordinates
  // const startLocation = [49.276291, -122.909554]; 
  // const endLocation = [49.231408, -122.836461];   
  // const userPosition = [49.231408, -122.836461];   
  // const userPosition = [49.257112, -122.916780];  

  // convert coordinates to address
  const getAddress = async (lat, lng, setAddress) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await response.json();

      if(data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress("Address not found")
      } 
    } catch (error) {
        console.error("Error fetching address: ", error);
        setAddress("Error fetching address");
    }
  };

  useEffect(() => {
    getAddress(startLocation[0], startLocation[1], setStartAddress);
    getAddress(endLocation[0], endLocation[1], setEndAddress);
  }, []);

  // Haversine formula to calculate the distance between two points
  const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Return distance in meters
  };

  console.log("Start Location:", startLocation);
  console.log("End Location:", endLocation);
  console.log("Route:", route);

  const fetchRoute = async () => {
    if (!startLocation || !endLocation) {
      console.error("Start or end location is missing");
      return;
    }
  
    const url = `http://127.0.0.1:8000/api/routes/get-route/?start_lat=${startLocation[0]}&start_lng=${startLocation[1]}&end_lat=${endLocation[0]}&end_lng=${endLocation[1]}`;
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        console.error("Failed to fetch route:", response.statusText);
        return;
      }
  
      const data = await response.json();
  
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];  // Get the first route
        if (route.geometry) {
          // Decode the geometry string into coordinates
          const routeCoordinates = polyline.decode(route.geometry).map(([lat, lng]) => [lat, lng]);
  
          // Set the decoded coordinates as route
          setRoute(routeCoordinates);
  
          // Extract the distance from the route
          const routeDistanceMeters = route.summary.distance; // In meters
  
          // Set state for total distance and distance left
          setTotalDistance(routeDistanceMeters);
          setDistanceLeft(routeDistanceMeters);
  
          // Print the total distance to the console
          console.log(`Total distance: ${routeDistanceMeters} meters`);
        } else {
          console.error("Route geometry is missing");
        }
      } else {
        console.error("No valid routes found in the response:", data);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const Modal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-80">
            <h2 className="text-gray-600 text-xl font-bold mb-4">Trip Complete!</h2>
            <p className="text-gray-600 mb-4">prize prize prize</p>
            <div className="flex justify-around">
              <Link 
                to="/trip-rewards"
                state={{ startLocation, endLocation }}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Hooray!
              </Link>
            </div>
          </div>
        </div>
    );
  };

  useEffect(() => {
    fetchRoute();
  }, []); 


  // Track user's position and calculate the distance to the destination
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Calculate the distance from the user's current position to the endLocation
        const distance = haversineDistance(latitude, longitude, endLocation[0], endLocation[1]);
        
        setDistanceLeft(distance);

        // Check if the user has arrived
        if (distance < 50 && !arrived) {
          setArrived(true);
          setShowModal(true);
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [arrived, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Ongoing Trip</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold">Start Destination</p>
            <p className="text-gray-600">{startAddress}</p>
          </div>

          <div className="w-full h-64 relative">
            <MapContainer center={userPosition || startLocation} zoom={13} className="h-full w-full z-10">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={startLocation} icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png', iconSize: [25, 41], iconAnchor: [12, 41] })} />
              <Marker position={endLocation} icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png', iconSize: [25, 41], iconAnchor: [12, 41] })} />
              {route && <Polyline positions={route} color="blue" />}
            </MapContainer>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold">End Destination</p>
            <p className="text-gray-600">{endAddress}</p>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold">Total Distance</p>
            <p className="text-gray-600"> {totalDistance !== null ? `${(totalDistance / 1000).toFixed(2)} km` : "Loading..."}
            </p>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold">
              {arrived ? "You have arrived!" : `${Math.round(distanceLeft)}m Left`}
            </p>
          </div>
        </div>

        <button onClick={() => setShowWarning(true)} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition w-full mt-4">
          Abandon Trip
        </button>
      </div>

      {showWarning && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-80">
            <h2 className="text-gray-600 text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-4 text-gray-600">If you abandon the trip, the cow will lose health!</p>
            <div className="flex justify-around">
              <button onClick={() => setShowWarning(false)} className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition">
                Cancel
              </button>
              <button onClick={() => { setShowWarning(false); alert("Trip abandoned. The cow will lose health."); navigate('/home'); }} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
                Abandon
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Show arrival modal */}
        <Modal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          message="You have arrived at your destination!" 
        />
    </div>
  );
}
