import React, { useState } from "react";
import { Copy, Search } from "lucide-react";
import { getLatLngFromDigiPin } from "../utils/digipin";

const StatusBar = ({ location, onSearchLocation }) => {
  const [copied, setCopied] = useState(false);
  const [searchPin, setSearchPin] = useState("");
  const [searchError, setSearchError] = useState("");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(location.digiPin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleSearch = () => {
    setSearchError("");
    try {
      const coords = getLatLngFromDigiPin(searchPin.trim());
      onSearchLocation({
        lat: parseFloat(coords.latitude),
        lng: parseFloat(coords.longitude),
        digiPin: searchPin.trim(),
      });
      setSearchPin("");
    } catch (error) {
      console.error("Error searching Bharat PIN:", error);
      setSearchError("Invalid Bharat PIN");
    }
  };

  return (
    <div className="bg-gray-50 border-t p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              Location Selected
            </span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-600 truncate">
              Bharat PIN:{" "}
              <span className="font-mono font-semibold text-red-600">
                {location.digiPin}
              </span>
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-black text-white rounded-md text-sm flex gap-2 items-center"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Quick Copy"}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="text"
            value={searchPin}
            onChange={(e) => setSearchPin(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
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
      </div>
      {searchError && (
        <div className="text-xs text-red-500 mt-2">{searchError}</div>
      )}
    </div>
  );
};

export default StatusBar;
