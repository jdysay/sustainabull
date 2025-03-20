import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
    useEffect(() => {
        const map = L.map("map".setView[51.505, -0.09], 13); // default view
       
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // get user location
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    // marker to show user location
                    L.marker([latitude, longitude])
                        .addTo(map)
                        .bindPopup("You are here")
                        .openPopup();

                        map.setView([latitude, longitude], 15);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }

        return () => {
            map.remove();
        };
    }, []);
    // switch to tailwind
    return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

