import { useState } from "react";
import { Search } from "lucide-react";
import { getLatLngFromDigiPin } from "../../utils/digipin";

export default function PinSearchInput({ onSearch }) {
  const [searchPin, setSearchPin] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    setError("");
    try {
      const coords = getLatLngFromDigiPin(searchPin.trim());
      onSearch({
        lat: parseFloat(coords.latitude),
        lng: parseFloat(coords.longitude),
        digiPin: searchPin.trim(),
      });
      setSearchPin("");
    } catch (err) {
      console.error("Search error:", err);
      setError("Invalid Bharat PIN");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchPin}
          onChange={(e) => setSearchPin(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter Bharat PIN"
          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          maxLength={13}
        />
        <button
          onClick={handleSearch}
          className="px-3 py-1.5 bg-black text-white rounded-md text-sm flex gap-2 items-center"
          aria-label="Find Location by Bharat PIN"
        >
          <Search className="w-4 h-4" />
          Find
        </button>
      </div>
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
