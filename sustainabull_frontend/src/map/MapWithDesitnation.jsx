import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapWithDestination = () => {
    const [destination, setDestination] = useState("");
    const [map, setMap] = useState(null);
    const [userCoords, setUserCoords] = useState(null);

    useEffect(() => {
        // Initialize the map only once
        if (map) return; // Exit if the map has already been initialized
      
        const myMap = L.map("map").setView([0, 0], 2); // Default view
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(myMap);
        setMap(myMap);
      
        // Get user location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserCoords([longitude, latitude]); // [lng, lat]
            myMap.setView([latitude, longitude], 13);
            L.marker([latitude, longitude]).addTo(myMap).bindPopup("Your Location").openPopup();
          },
          (error) => console.error("Geolocation error:", error)
        );
      }, [map]); // Only run this effect when `map` is null (initial render)

    const getCoordinates = async (address) => {
        const apiKey = "5b3ce3597851110001cf62482bc4682312c147278f9e1bea01b00d36";
        const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.features.length > 0) {
                return data.features[0].geometry.coordinates; // [longitude, latitude]
            }
        } catch (error) {
            console.error("Geolocation error:", error);
            // Handle different error codes (e.g., permission denied, timeout)
            if (error.code === error.PERMISSION_DENIED) {
            alert("Permission to access location was denied. Please enable location access.");
            } else if (error.code === error.TIMEOUT) {
            alert("Geolocation request timed out. Please try again.");
            } else {
            alert("An unknown error occurred while fetching location.");
            }
        }

        return null;
    };

    const drawRoute = async (startCoords, endCoords) => {
        const apiKey = "5b3ce3597851110001cf62482bc4682312c147278f9e1bea01b00d36";
        const url = `https://api.openrouteservice.org/v2/directions/foot-walking/geojson?api_key=${apiKey}&start=${startCoords[0]},${startCoords[1]}&end=${endCoords[0]},${endCoords[1]}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            L.geoJSON(data, {
                style: { color: "blue", weight: 4 },
            }).addTo(map);
        } catch (error) {
            console.error("Error drawing route:", error);
        }
    };

    const getDistance = (startCoords, endCoords) => {
        const [lon1, lat1] = startCoords;
        const [lon2, lat2] = endCoords;

        const R = 6371e3; // Radius of Earth in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    };

    const handleSearch = async () => {
        if (!map || !userCoords) return;

        const coords = await getCoordinates(destination);
        if (coords) {
            const [longitude, latitude] = coords;

            // Move map to destination and add marker
            map.setView([latitude, longitude], 13);
            L.marker([latitude, longitude]).addTo(map).bindPopup("Destination").openPopup();
        }

        const startCoords = userCoords;
        const endCoords = coords;

        if (endCoords) {
            await drawRoute(startCoords, endCoords);
            const distance = getDistance(startCoords, endCoords);
            console.log(`Distance to destination: ${(distance / 1000).toFixed(2)} km`);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-blue-700 to-blue-400 flex flex-col items-center justify-center relative p-4">
            {/* Title and Location Form */}
            <div className="text-center mb-6 space-y-4">
                <h1 className="text-white text-3xl font-bold">Map with Destination</h1>
                <input
                    type="text"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="p-2 rounded-lg w-64 text-black"
                />
                <button
                    onClick={handleSearch}
                    className="bg-white text-blue-500 px-4 py-2 rounded-full shadow-lg mt-4"
                >
                    Find Route
                </button>
            </div>

            {/* Map Container */}
            <div id="map" className="w-full h-96 rounded-lg shadow-lg mb-6"></div>

            {/* Optional Button for Navigation */}
            <div className="flex justify-center pb-4 relative z-30">
                <button
                    className="bg-white text-blue-500 px-4 py-2 rounded shadow-lg"
                    onClick={() => alert("Go to another page or handle navigation")}
                >
                    Go to Login
                </button>
            </div>

            {/* Cloud or Background Images */}
            <img
                src="cloud1.png"
                alt="Cloud"
                className="w-64 h-auto absolute bottom-0 left-0 z-10"
            />
            <img
                src="cloud2.png"
                alt="Cloud"
                className="w-64 h-auto absolute bottom-0 left-40 z-20"
            />
        </div>
    );
};

export default MapWithDestination;
