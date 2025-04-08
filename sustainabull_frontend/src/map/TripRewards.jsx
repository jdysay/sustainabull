import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import polyline from 'polyline';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function TripRewards() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateGold } = useAuth();
  const [setDistanceLeft] = useState(null);
  const [route, setRoute] = useState(null);
  const [totalDistance, setTotalDistance] = useState(5000); // Default to 5km for testing
  const [rewardsApplied, setRewardsApplied] = useState(false);
  const selectedMode = location.state?.selectedMode || "Walk"; // default is walk
  const { startLocation = [0, 0], endLocation = [0, 0] } = location.state || {};

  // test coordinates
  // const startLocation = [49.276291, -122.909554]; 
  // const endLocation = [49.231408, -122.836461];   
  // const userPosition = [49.231408, -122.836461];   

  console.log("Start Location:", startLocation);
  console.log("End Location:", endLocation);
  console.log("Route:", route);

  const fetchRoute = async () => {
    if (!startLocation || !endLocation) {
      console.error("Start or end location is missing");
      return;
    }
  
    const url = `http://localhost:8000/api/routes/get-route/?start_lat=${startLocation[0]}&start_lng=${startLocation[1]}&end_lat=${endLocation[0]}&end_lng=${endLocation[1]}`;
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        console.error("Failed to fetch route:", response.statusText);
        // If we can't fetch the route, just use the default distance for testing
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

  // Function to update the user's gold
  const updateUserGold = async (coinsToAdd) => {
    try {
      if (!user) {
        console.error("No user found");
        return false;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        return false;
      }

      // Get current user data to get the current gold amount
      const userResponse = await axios.get(
        'http://localhost:8000/api/accounts/user/',
        { headers: { 'Authorization': `Token ${token}` } }
      );

      const currentGold = userResponse.data.gold || 0;
      const newGold = currentGold + coinsToAdd;

      // Update gold in database
      const updateResponse = await axios.patch(
        'http://localhost:8000/api/accounts/update-gold/',
        { gold: newGold },
        { headers: { 'Authorization': `Token ${token}` } }
      );

      if (updateResponse.data.success) {
        // Update local state with updateGold function from context
        updateGold(newGold);
        console.log(`Gold updated from ${currentGold} to ${newGold}`);
        return true;
      } else {
        console.error("Failed to update gold:", updateResponse.data);
        return false;
      }
    } catch (error) {
      console.error("Error updating gold:", error);
      return false;
    }
  };

  // Function to add food to user's inventory
  const addFoodToInventory = async (foodName, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        return false;
      }

      // Use hardcoded "4" for corn chunks
      const response = await axios.post(
        'http://localhost:8000/api/shop/add-to-inventory/',
        { 
          item_id: 4, // Hardcoding corn chunks ID to 4
          quantity: quantity 
        },
        { 
          headers: { 
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`Added ${quantity} ${foodName} to inventory:`, response.data);
      return true;
    } catch (error) {
      console.error(`Error adding ${foodName} to inventory:`, error);
      return false;
    }
  };

  // Function to update cow stats based on travel
  const updateCowStats = async (distance, mode) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        return false;
      }

      // Map the frontend mode to backend transport_type
      const transportTypeMap = {
        'Walk': 'walk',
        'Bike': 'bike',
        'Transit': 'transit',
        'Drive': 'vehicle',
        'Drive (electric vehicle)': 'vehicle'
      };

      const transportType = transportTypeMap[mode] || 'walk';

      // Update cow stats via travel endpoint
      const response = await axios.post(
        'http://localhost:8000/api/shop/travel/',
        {
          distance_meters: Math.round(distance),
          transport_type: transportType
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`Updated cow stats for ${distance}m ${mode} travel:`, response.data);
      return true;
    } catch (error) {
      console.error("Error updating cow stats:", error);
      return false;
    }
  };

  // Apply all rewards to backend
  const applyRewards = async () => {
    if (rewardsApplied || !totalDistance) return;
    
    try {
      // 1. Update user's gold
      await updateUserGold(rewards.coins);
      
      // 2. Add food to inventory
      const foodQuantity = parseInt(rewards.food.split(' ')[0]); // 20 from "20 corn chunks"
      await addFoodToInventory("corn chunks", foodQuantity);
      
      // 3. Update cow stats
      await updateCowStats(totalDistance, selectedMode);
      
      setRewardsApplied(true);
    } catch (error) {
      console.error("Error applying rewards:", error);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []); 
  
  // Apply rewards when distance is available
  useEffect(() => {
    if (totalDistance && !rewardsApplied) {
      applyRewards();
    }
  }, [totalDistance]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-custom-orange-dark">Trip Complete!</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="space-y-4">
          <div className="w-full h-64 relative">
            <MapContainer center={startLocation} zoom={13} className="h-full w-full z-10">
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
            <p className="text-custom-orange mb-2"> {totalDistance !== null ? `${(totalDistance / 1000).toFixed(2)} km` : "Loading..."}</p>
            <p className="text-lg font-semibold text-custom-orange-dark">Points Earned</p>
            <p className="text-custom-orange mb-2">{rewards.xp} XP</p>
            <p className="text-lg font-semibold text-custom-orange-dark">Coins Earned</p>
            <p className="text-custom-orange mb-2">{rewards.coins} coins</p>
            <p className="text-lg font-semibold text-custom-orange-dark">Food Earned</p>
            <p className="text-custom-orange mb-2">{rewards.food}</p>
          </div>
        </div>

        {/* Buttons container with flex layout */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/transportation-mode')}
            className="flex-1 bg-custom-orange-dark text-white py-2 px-4 rounded-lg hover:bg-custom-orange transition block border-none text-center"
          >
            Start New Trip
          </button>
          
          <button
            onClick={() => navigate('/home')}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition block border-none text-center"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
