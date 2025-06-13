import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Copy,
  CheckCircle,
  X,
  Home,
  Map,
  Mailbox,
  Flag,
} from "lucide-react";

const fetchAddress = async ({ queryKey }) => {
  const [_key, { lat, lng }] = queryKey;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
  );
  if (!response.ok) throw new Error("Failed to fetch address");
  const data = await response.json();
  return data.address;
};

const DigipinPopup = ({ location, onClose }) => {
  const [copied, setCopied] = useState(false);

  const {
    data: address,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["address", { lat: location.lat, lng: location.lng }],
    queryFn: fetchAddress,
    refetchOnWindowFocus: false,
    enabled: !!location.lat && !!location.lng,
  });

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
      <div className="space-y-4">
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
        <div className="border-t pt-3 space-y-2 text-sm">
          {isPending ? (
            <div className="text-center text-gray-500">Loading address...</div>
          ) : isError ? (
            <div className="text-center text-gray-500">Address not found</div>
          ) : address ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                <Home className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Town/Village
                  </div>
                  <div className="font-semibold text-gray-800">
                    {address.county || "N/A"}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                <Map className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    District
                  </div>
                  <div className="font-semibold text-gray-800">
                    {address.state_district || "N/A"}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                <Mailbox className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Pin Code
                  </div>
                  <div className="font-semibold text-gray-800">
                    {address.postcode || "N/A"}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                <Flag className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    State
                  </div>
                  <div className="font-semibold text-gray-800">
                    {address.state || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">Address not found</div>
          )}
        </div>
        <div className="text-xs text-gray-500 text-center border-t pt-2">
          Click anywhere else on the map to select a new location
        </div>
      </div>
    </div>
  );
};

export default DigipinPopup;
