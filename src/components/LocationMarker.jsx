import React from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import DigipinPopup from "./DigipinPopup";
import { getDigiPin } from "../utils/digipin";

const LocationMarker = ({ location, onSelect, onClear }) => {
  useMapEvents({
    click(e) {
      if (
        e.originalEvent.target.id === "current-location-button" ||
        e.originalEvent.target.closest("#current-location-button")
      ) {
        return;
      }
      let digiPin;
      try {
        digiPin = getDigiPin(e.latlng.lat, e.latlng.lng);
      } catch {
        digiPin = "Out of range";
      }
      onSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        digiPin,
      });
    },
  });

  if (!location) return null;

  return (
    <Marker position={[location.lat, location.lng]}>
      <Popup
        className="instant-popup"
        autoClose={false}
        closeOnClick={false}
        closeButton={false}
      >
        <DigipinPopup location={location} onClose={onClear} />
      </Popup>
    </Marker>
  );
};

export default LocationMarker;
