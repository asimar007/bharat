import { useMapEvents } from "react-leaflet";
import { getDigiPin } from "../../utils/digipin";

export default function MarkerEventHandler({ onSelect }) {
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

  return null;
}
