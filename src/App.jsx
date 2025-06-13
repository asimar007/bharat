import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./utils/leafletIconFix";
import LocationMarker from "./components/LocationMarker";
import StatusBar from "./components/StatusBar";
import { getDigiPin } from "./utils/digipin";

const initialPosition = { lat: 24.452531, lng: 87.84183 };
const initialDigiPin = getDigiPin(initialPosition.lat, initialPosition.lng);

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState({
    ...initialPosition,
    digiPin: initialDigiPin,
  });
  const [mapPosition, setMapPosition] = useState(initialPosition);

  useEffect(() => {
    const getUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setMapPosition(userLocation);
            try {
              const pin = getDigiPin(userLocation.lat, userLocation.lng);
              setSelectedLocation({ ...userLocation, digiPin: pin });
            } catch (error) {
              console.error("Error generating DIGIPIN:", error);
              const defaultPin = getDigiPin(
                initialPosition.lat,
                initialPosition.lng
              );
              setSelectedLocation({ ...initialPosition, digiPin: defaultPin });
            }
          },
          () => {
            console.log("Using default location");
            const defaultPin = getDigiPin(
              initialPosition.lat,
              initialPosition.lng
            );
            setSelectedLocation({ ...initialPosition, digiPin: defaultPin });
          }
        );
      } else {
        console.log("Geolocation not supported");
        const defaultPin = getDigiPin(initialPosition.lat, initialPosition.lng);
        setSelectedLocation({ ...initialPosition, digiPin: defaultPin });
      }
    };

    getUserLocation();
  }, []);

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
