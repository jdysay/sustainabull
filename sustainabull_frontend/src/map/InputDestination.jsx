import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';


export default function InputDestination() {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const[userPosition, setUserPosition] = useState(null);
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // get user's current location with Geolocation API
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } =  position.coords;
        setUserPosition([latitude, longitude]);
        setStartLocation([latitude, longitude]); // Default start location

        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.display_name) {
            setStartAddress(data.display_name);
          } else {
            setStartAddress("Unknown location");
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      },
      (error) => console.error("Error getting location: ", error),
      { enableHighAccuracy: true }
    );
  }, []);

  // fetch address suggestions for end destination
  const handleSearch = async (query) => {
    setEndAddress(query); // update input field

    if(!query) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();

      setSearchResults(data.map((place => ({
        name: place.display_name,
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
      }))));
    } catch (error) {
        console.error("Error searching address:", error)
    }
  };

  // select address from dropdown
  const handleSelectAddress = (location) => {
    setEndAddress(location.name);
    setEndLocation([location.lat, location.lon]);
    setSearchResults([]); // clear suggestions
  }

  // fetch route using OpenRouteService API
  const fetchRoute = async () => {
    if(! startLocation || !endLocation) {
      console.error("Start or end location is missing");
      return;
    }
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
  
  // update map view
  function UpdateMapView({ position }) {
    const map = useMap();
    useEffect(() => {
      if(position) {
        map.setView(position, 13);
      }
    }, [position, map]);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Input Destination</h1>
     
     {/* Input Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="space-y-4">

          { /* Start Destination (pre-filled with user's location) */}
          <input
            type="text"
            placeholder="Fetching current location..."
            value={startAddress}
            className="w-full p-2 border border-gray-300 rounded-lg"
            onChange={(e) => setStartAddress(e.target.value)} // Allow users to edit
          />

           {/* search for end destination */}
          <input
            type="text"
            placeholder="End Destination"
            value={endAddress}
            className="w-full p-2 border border-gray-300 rounded-lg"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {/* Show search results */}
          {searchResults.length > 0 && (
            <ul className="border border-gray-300 rounded-lg bg-white shadow-md">
              {searchResults.map((location, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectAddress(location)}
                >
                  {location.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Map */}
        <div className="mt-6 w-full h-64">
        <MapContainer center={userPosition || [51.505, -0.09]} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* Auto-update map view */}
          <UpdateMapView position={userPosition} />
          
          {startLocation && <Marker position={startLocation} icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png', iconSize: [25, 41], iconAnchor: [12, 41] })} />}
          {endLocation && <Marker position={endLocation} />}
          {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>

        </div>

        <div className="mt-6 flex justify-between">
            <Link to="/transportation-mode" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Back
            </Link>
            <Link 
              to="/ongoing-trip"
              state={{ startLocation, endLocation, route }}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Next
            </Link>
        </div>
      </div>
        <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
            Home
        </Link>
    </div>
  );
}