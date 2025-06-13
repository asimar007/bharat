import { GeoJSON } from "react-leaflet";

export default function IndiaBorderLayer({ data }) {
  if (!data) return null;

  return (
    <GeoJSON
      data={data}
      style={() => ({
        color: "#000",
        weight: 5,
        opacity: 0.65,
        fillColor: "transparent",
        fillOpacity: 0,
      })}
    />
  );
}
