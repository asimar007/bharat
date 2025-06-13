import { useState } from "react";
import { getDigiPin } from "../utils/digipin";
import { useIndiaBorder } from "../hooks/useIndiaBorder";
import MapWrapper from "../components/MapWrapper";
import IndiaBorderLayer from "../components/IndiaBorderLayer";
import LocationMarker from "../components/LocationMarker/LocationMarker";
import CurrentLocationButton from "../components/CurrentLocationButton";
import StatusBar from "../components/StatusBar/StatusBar";
import ErrorBanner from "../components/ErrorBanner";

const initialPosition = { lat: 28.6448, lng: 77.216721 }; // Default Location (Delhi)

export default function MapPage() {
  const { data: indiaBorderGeoJSON } = useIndiaBorder();
  const initialDigiPin = getDigiPin(initialPosition.lat, initialPosition.lng);

  const [selectedLocation, setSelectedLocation] = useState({
    ...initialPosition,
    digiPin: initialDigiPin,
  });
  const [mapPosition, setMapPosition] = useState(initialPosition);
  const [locationError, setLocationError] = useState(null);

  const handleLocationFound = (latlng) => {
    setLocationError(null);
    const newDigiPin = getDigiPin(latlng.lat, latlng.lng);
    setSelectedLocation({ ...latlng, digiPin: newDigiPin });
    setMapPosition(latlng);
  };

  const handleLocationError = (error) => {
    console.error("Location error:", error);
    setLocationError(error.message);
    const defaultPin = getDigiPin(initialPosition.lat, initialPosition.lng);
    setSelectedLocation({ ...initialPosition, digiPin: defaultPin });
    setMapPosition(initialPosition);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <div className="flex-1 w-full relative">
        <MapWrapper center={mapPosition}>
          <IndiaBorderLayer data={indiaBorderGeoJSON} />
          <LocationMarker
            location={selectedLocation}
            onSelect={setSelectedLocation}
            onClear={() => setSelectedLocation(null)}
          />
          <CurrentLocationButton
            onLocationFound={handleLocationFound}
            onLocationError={handleLocationError}
          />
        </MapWrapper>

        <ErrorBanner message={locationError} />
      </div>

      {selectedLocation && (
        <div className="w-full">
          <StatusBar
            location={selectedLocation}
            onSearchLocation={(loc) => {
              setMapPosition({ lat: loc.lat, lng: loc.lng });
              setSelectedLocation(loc);
            }}
          />
        </div>
      )}
    </div>
  );
}
