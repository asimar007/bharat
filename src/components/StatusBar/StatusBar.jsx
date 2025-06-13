import React from "react";
import CopyPinButton from "./CopyPinButton";
import PinSearchInput from "./PinSearchInput";

export default function StatusBar({ location, onSearchLocation }) {
  return (
    <div className="bg-white border-t shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Mobile View */}
        <div className="sm:hidden">
          <div className="p-3 space-y-3">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <span className="text-sm text-gray-600">
                Bharat PIN:{" "}
                <span className="font-mono font-semibold text-red-600">
                  {location.digiPin}
                </span>
              </span>
              <CopyPinButton text={location.digiPin} />
            </div>

            <div className="w-full">
              <PinSearchInput onSearch={onSearchLocation} />
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block p-4">
          <div className="flex items-center justify-between gap-4">
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
                <CopyPinButton text={location.digiPin} />
              </div>
            </div>
            <div className="ml-auto">
              <PinSearchInput onSearch={onSearchLocation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
