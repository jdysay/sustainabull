import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import polyline from 'polyline';



export default function TripRewards() {
  const navigate = useNavigate();
  const [setDistanceLeft] = useState(null);
  const [route, setRoute] = useState(null);
  const [totalDistance, setTotalDistance] = useState(null);
  const selectedMode = location.state?.selectedMode || "Walk"; // default is walk

  // test coordinates
  const startLocation = [49.276291, -122.909554]; 
  const endLocation = [49.231408, -122.836461];   
  const userPosition = [49.231408, -122.836461];   

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

  const calculateRewards = () => {
    if(selectedMode === "Drive") {
      return { xp: totalDistance ? Math.round((totalDistance * 0.1)/10) : 0, coins: Math.round(totalDistance * 0.1), food: "10 corn chunks"};
    }

    const xp = totalDistance ? Math.round((totalDistance * 1)/10) : 0;
    const coins = Math.round(totalDistance * 1) ;
    const food = "20 corn chunks";

    return { xp, coins, food };
  };

  const rewards = calculateRewards();

  useEffect(() => {
    fetchRoute();
  }, []); 


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-custom-orange-dark">Trip Complete!</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="space-y-4">

          <div className="w-full h-64 relative">
            <MapContainer center={userPosition || startLocation} zoom={13} className="h-full w-full z-10">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={startLocation} icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png', iconSize: [25, 41], iconAnchor: [12, 41] })} />
              <Marker position={endLocation} />
              <Marker position={endLocation} icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png', iconSize: [25, 41], iconAnchor: [12, 41] })} />
              {route && <Polyline positions={route} color="blue" />}
            </MapContainer>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-custom-orange-dark mb-5">Rewards</p>
            <p className="text-lg font-semibold text-custom-orange-dark">Total Distance</p>
            <p className="text-custom-orange mb-2">{totalDistance !== null ? `${Math.round(totalDistance)} meters` : "Loading..."}</p>
            <p className="text-lg font-semibold text-custom-orange-dark">Points Earned</p>
            <p className="text-custom-orange mb-2">{rewards.xp} XP</p>
            <p className="text-lg font-semibold text-custom-orange-dark">Coins Earned</p>
            <p className="text-custom-orange mb-2">{rewards.coins} coins</p>
            <p className="text-lg font-semibold text-custom-orange-dark">Food Earned</p>
            <p className="text-custom-orange mb-2">{rewards.food}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/transportation-mode')}
          className="mt-6 w-full bg-custom-orange-dark text-white py-2 px-4 rounded-lg hover:bg-custom-orange transition block border-none text-center"
        >
          Next
        </button>
      </div>
    </div>
  );
}
