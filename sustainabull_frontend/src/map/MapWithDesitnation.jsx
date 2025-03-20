import { useState, useEffect } from "react";
import L from "leaflet"; 
import "leaflet/dist/leaflet.css";

const MapWithDestination = () => {
    const [destination, setDestination] = useState("");
    const [map, setMap] = useState(null);

    useEffect(() => {
        const myMap = L.map("map").setView([0, 0], 2); // Default view
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(myMap);
        setMap(myMap);
    }, []);

    const getCoordinates = async (address) => {
        const apiKey = "5b3ce3597851110001cf62482bc4682312c147278f9e1bea01b00d36";
        const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(
            address
        )}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.features.length > 0) {
                return data.features[0].geometry.coordinates; // [longitude, latitude]
            }
        } catch (error) {
            console.error("Error getting coordinates: ", error);
        }

        return null;
    };

    const drawRoute = async (startCoords, endCoords) => {
        const apiKey = "5b3ce3597851110001cf62482bc4682312c147278f9e1bea01b00d36";
        const url = `https://api.openrouteservice.org/v2/directions/foot-walking/geojson?api_key=${apiKey}&start=${startCoords[1]},${startCoords[0]}&end=${endCoords[1]},${endCoords[0]}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            L.getJSON(data, {
                style: { color: "blue", weight: 4},
            }).addTo(map);
        } catch (error) {
            console.error("Error drawing route:", error);
        }
    };

    const handleSearch = async () => {
        if (!map) return;

        const coords = await getCoordinates(destination);
        if (coords) {
            const [longitude, latitude] = coords;

            // Move map to destination and add marker
            map.setView([latitude, longitude], 13);
            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup("Destination")
                .openPopup();
        }

        const startCoords = [userLongitude, userLatitude];
        const endCoords = await getCoordinates(destination);

        if(endCoords) {
            await drawRoute(startCoords, endCoords);
            const distance = await getDistance(startCoords, endCoords);
            console.log(`Distance to destination: ${distance / 1000} km`);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <div id="map" style={{ height: "400px", width: "100%" }}></div>
        </div>
    );
};

export default MapWithDestination;
