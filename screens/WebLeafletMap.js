import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default marker
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// NGO marker icon
const ngoIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Component to center the map programmatically
function ChangeCenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], 14);
  }, [coords]);
  return null;
}

export default function WebLeafletMap({ address }) {
  const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629 });
  const [nearbyNgos, setNearbyNgos] = useState([]);

  // Convert address → coordinates
  useEffect(() => {
    if (!address) return;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const newCoords = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          };
          setCoords(newCoords);
        }
      });
  }, [address]);

  // Fetch nearby NGOs automatically
  useEffect(() => {
  if (!coords) return;

  const { lat, lng } = coords;

  const query = `
    [out:json][timeout:25];
    (
      node["office"="ngo"](around:3000, ${lat}, ${lng});
      node["amenity"="social_facility"]["social_facility"="ngo"](around:3000, ${lat}, ${lng});
    );
    out center;
  `;

  fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"  // IMPORTANT FIX
    }
  })
    .then(async (res) => {
      const text = await res.text();

      // If server returns HTML (error page), stop.
      if (text.startsWith("<")) {
        console.log("Overpass returned HTML (rate-limited).");
        return;
      }

      const json = JSON.parse(text);
      setNearbyNgos(json.elements || []);
      console.log("Nearby NGOs:", json.elements);
    })
    .catch((err) => console.log("Overpass error:", err));
}, [coords]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeCenter coords={coords} />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User-selected location */}
        <Marker position={[coords.lat, coords.lng]} icon={icon}>
          <Popup>{address || "Selected Location"}</Popup>
        </Marker>

        {/* Auto-detected NGOs */}
        {nearbyNgos.map((ngo) => {
          const lat = ngo.lat || ngo.center?.lat;
          const lon = ngo.lon || ngo.center?.lon;

          if (!lat || !lon) return null;

          return (
            <Marker key={ngo.id} position={[lat, lon]} icon={ngoIcon}>
              <Popup>
                <b>{ngo.tags?.name || "NGO"}</b> <br />
                {ngo.tags?.operator || ""} <br />
                {ngo.tags?.description || ""}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
