import React, { useState } from "react";
import { MapPin, Copy, CheckCircle, X } from "lucide-react";
import { useAddress } from "../../hooks/useAddress";
import AddressDetails from "./AddressDetails";

export default function DigipinPopup({ location, onClose }) {
  const [copied, setCopied] = useState(false);
  const {
    data: address,
    isPending,
    isError,
  } = useAddress(location.lat, location.lng);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(location.digiPin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="instant-digipin-overlay p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-700" />
          <span className="font-bold text-gray-800 text-lg">
            Location Bharat PIN
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1 hover:bg-gray-100 rounded-full"
          title="Close"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* DigiPin Display + Copy Button */}
      <div className="text-center">
        <div className="bg-black text-white px-4 py-3 rounded-lg shadow-lg">
          <div className="font-mono text-2xl font-bold tracking-wider">
            {location.digiPin}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="mt-2 flex items-center gap-2 mx-auto px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-red-700 rounded-md transition-colors text-sm"
          aria-label="Copy DIGIPIN"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Bharat PIN
            </>
          )}
        </button>
      </div>

      {/* Address Info */}
      <div className="border-t pt-3 space-y-2 text-sm">
        {isPending && (
          <div className="text-center text-gray-500">Loading address...</div>
        )}
        {isError && (
          <div className="text-center text-gray-500">Address not found</div>
        )}
        {address && <AddressDetails address={address} />}
      </div>

      <div className="text-xs text-gray-500 text-center border-t pt-2">
        Click anywhere else on the map to select a new location
      </div>
    </div>
  );
}
