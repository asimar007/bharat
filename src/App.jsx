import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./utils/leafletIconFix";
import LocationMarker from "./components/LocationMarker";
import StatusBar from "./components/StatusBar";
import { getDigiPin } from "./utils/digipin";
import CurrentLocationButton from "./components/CurrentLocationButton";

const initialPosition = { lat: 28.6448, lng: 77.216721 }; // Default location (Delhi)

const fetchIndiaBorder = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch India border GeoJSON");
  }
  return response.json();
};

export default function MapPage() {
  const initialDigiPin = getDigiPin(initialPosition.lat, initialPosition.lng);
  const [selectedLocation, setSelectedLocation] = useState({
    ...initialPosition,
    digiPin: initialDigiPin,
  });
  const [mapPosition, setMapPosition] = useState(initialPosition);
  const [locationError, setLocationError] = useState(null);

  // Use TanStack Query to fetch India border GeoJSON
  const { data: indiaBorderGeoJSON } = useQuery({
    queryKey: ["indiaBorder"],
    queryFn: fetchIndiaBorder,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const handleLocationFound = (latlng) => {
    setLocationError(null);
    const newDigiPin = getDigiPin(latlng.lat, latlng.lng);
    setSelectedLocation({
      lat: latlng.lat,
      lng: latlng.lng,
      digiPin: newDigiPin,
    });
    setMapPosition(latlng);
  };

  const handleLocationError = (error) => {
    console.log("Location error:", error);
    setLocationError(error.message);

    // Set to default location
    const defaultPin = getDigiPin(initialPosition.lat, initialPosition.lng);
    setSelectedLocation({ ...initialPosition, digiPin: defaultPin });
    setMapPosition(initialPosition);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 w-full relative">
        <MapContainer
          center={[mapPosition.lat, mapPosition.lng]}
          zoom={13}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {indiaBorderGeoJSON && (
            <GeoJSON
              data={indiaBorderGeoJSON}
              style={() => ({
                color: "#000",
                weight: 5,
                opacity: 0.65,
                fillColor: "transparent",
                fillOpacity: 0,
              })}
            />
          )}
          <LocationMarker
            location={selectedLocation}
            onSelect={setSelectedLocation}
            onClear={() => setSelectedLocation(null)}
          />
          <CurrentLocationButton
            onLocationFound={handleLocationFound}
            onLocationError={handleLocationError}
          />
        </MapContainer>
        {locationError && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-lg z-50 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {locationError}
          </div>
        )}
      </div>

      {selectedLocation && (
        <StatusBar
          location={selectedLocation}
          onSearchLocation={(loc) => {
            setMapPosition({ lat: loc.lat, lng: loc.lng });
            setSelectedLocation(loc);
          }}
        />
      )}
    </div>
  );
}
