import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./utils/leafletIconFix";
import LocationMarker from "./components/LocationMarker";
import StatusBar from "./components/StatusBar";
import { getDigiPin } from "./utils/digipin";

const initialPosition = { lat: 24.452531, lng: 87.84183 };

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

  // Use TanStack Query to fetch India border GeoJSON
  const { data: indiaBorderGeoJSON } = useQuery({
    queryKey: ["indiaBorder"],
    queryFn: fetchIndiaBorder,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Use TanStack Query to fetch user's location
  const { data: _userLocation } = useQuery({
    queryKey: ["userLocation"],
    queryFn: () => {
      if ("geolocation" in navigator) {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              resolve(userLocation);
            },
            () => {
              console.log("Using default location");
              const defaultPin = getDigiPin(
                initialPosition.lat,
                initialPosition.lng
              );
              resolve({ ...initialPosition, digiPin: defaultPin });
            }
          );
        });
      } else {
        console.log("Geolocation not supported");
        const defaultPin = getDigiPin(initialPosition.lat, initialPosition.lng);
        return Promise.resolve({ ...initialPosition, digiPin: defaultPin });
      }
    },
    onSuccess: (loc) => {
      setMapPosition(loc);
      try {
        const pin = getDigiPin(loc.lat, loc.lng);
        setSelectedLocation({ ...loc, digiPin: pin });
      } catch {
        console.log("Using default location for digipin");
        const defaultPin = getDigiPin(initialPosition.lat, initialPosition.lng);
        setSelectedLocation({ ...initialPosition, digiPin: defaultPin });
      }
    },
    onError: (error) => {
      console.error("Error fetching user location:", error);
    },
  });

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
        </MapContainer>
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
