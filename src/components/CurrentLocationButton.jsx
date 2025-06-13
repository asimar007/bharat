import React from "react";
import { useMap } from "react-leaflet";
import { LocateFixed } from "lucide-react";

const CurrentLocationButton = ({ onLocationFound, onLocationError }) => {
  const map = useMap();

  const getErrorMessage = (error) => {
    switch (error.code) {
      case 1:
        return "Location access denied. Using default location.";
      case 2:
        return "Location unavailable. Using default location.";
      case 3:
        return "Location request timed out. Using default location.";
      default:
        return "Unable to get your location. Using default location.";
    }
  };

  const locateUser = (e) => {
    e.stopPropagation();

    // First check if geolocation is supported
    if (!navigator.geolocation) {
      onLocationError({
        message:
          "Geolocation is not supported by your browser. Using default location.",
        code: 0,
      });
      return;
    }

    // Request location with options
    map
      .locate({
        setView: false,
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      })
      .on("locationfound", function (e) {
        onLocationFound(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      })
      .on("locationerror", function (e) {
        const errorMessage = getErrorMessage(e);
        onLocationError({ message: errorMessage, code: e.code });
      });
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      <button
        id="current-location-button"
        onClick={(e) => {
          e.stopPropagation();
          locateUser(e);
        }}
        className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Find My Location"
      >
        <LocateFixed className="w-6 h-6 text-blue-600" />
      </button>
    </div>
  );
};

export default CurrentLocationButton;
