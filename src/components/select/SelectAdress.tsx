import React, { useState, useRef, useEffect } from "react";
import { Button, Select } from "antd";
import { CiLocationOn, CiSearch } from "react-icons/ci";
import type { LocationType } from "../../Types/Court";
import LeafletMap from "../map/LeafletMap";

interface AddressAutocompleteProps {
  onPlaceSelected: (data: LocationType | null) => void;
  value: LocationType;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onPlaceSelected,
  value,
}) => {
  const { latitude, longitude } = value || {};
  const [pendingLocation, setPendingLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch autocomplete predictions from OpenStreetMap Nominatim
  const fetchPredictions = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setPredictions([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=6`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setPredictions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Nominatim search error:", err);
      setPredictions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (text: string) => {
    setInputValue(text);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      fetchPredictions(text);
    }, 400);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // When a prediction is selected
  const handleSelect = (placeId: string) => {
    const selected = predictions.find(
      (pred) => String(pred.place_id) === String(placeId)
    );
    if (!selected) return;

    const addr = selected.address || {};
    const state =
      addr.state || addr.province || addr.region || addr.state_district || "";
    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.county ||
      "";
    const postal_code = addr.postcode || "";

    const addressDetails: LocationType = {
      state,
      city,
      postal_code,
      latitude: parseFloat(selected.lat),
      longitude: parseFloat(selected.lon),
    };

    onPlaceSelected(addressDetails);
    setInputValue(selected.display_name);
    setPredictions([]);
  };

  const handleClear = () => {
    setInputValue(undefined);
    setPredictions([]);
    onPlaceSelected(null);
  };

  // Marker drag end
  const handleMarkerDragEnd = (lat: number, lng: number) => {
    setPendingLocation({ lat, lng });
    setShowConfirm(true);
  };

  // Map click
  const handleMapClick = (lat: number, lng: number) => {
    setPendingLocation({ lat, lng });
    setShowConfirm(true);
  };

  const confirmDrag = async () => {
    if (!pendingLocation) return;

    try {
      // Reverse geocode new coordinate to get updated address details
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pendingLocation.lat}&lon=${pendingLocation.lng}&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const state =
          addr.state || addr.province || addr.region || value?.state || "";
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.municipality ||
          addr.county ||
          value?.city ||
          "";
        const postal_code = addr.postcode || value?.postal_code || "";

        onPlaceSelected({
          state,
          city,
          postal_code,
          latitude: pendingLocation.lat,
          longitude: pendingLocation.lng,
        });

        if (data.display_name) {
          setInputValue(data.display_name);
        }
      } else {
        onPlaceSelected({
          ...value,
          latitude: pendingLocation.lat,
          longitude: pendingLocation.lng,
        });
      }
    } catch {
      onPlaceSelected({
        ...value,
        latitude: pendingLocation.lat,
        longitude: pendingLocation.lng,
      });
    }

    setShowConfirm(false);
    setPendingLocation(null);
  };

  const cancelDrag = () => {
    setPendingLocation(null);
    setShowConfirm(false);
  };

  const hasCoordinates =
    latitude !== undefined &&
    longitude !== undefined &&
    !isNaN(Number(latitude)) &&
    !isNaN(Number(longitude)) &&
    (Number(latitude) !== 0 || Number(longitude) !== 0);

  return (
    <div className="w-full">
      <Select
        prefix={<CiSearch />}
        showSearch
        value={inputValue}
        placeholder="Search address or location..."
        className="!w-full"
        onSearch={handleSearch}
        onClear={handleClear}
        allowClear
        onSelect={handleSelect}
        filterOption={false}
        loading={isSearching}
        notFoundContent={isSearching ? "Searching..." : null}
      >
        {predictions.map((pred) => (
          <Select.Option key={pred.place_id} value={String(pred.place_id)}>
            <div className="grid grid-cols-10 gap-2 items-start py-1">
              <CiLocationOn className="text-xl text-emerald-600 mt-0.5 col-span-1 flex-shrink-0" />
              <span className="text-xs leading-snug col-span-9 break-words whitespace-normal">
                {pred.display_name}
              </span>
            </div>
          </Select.Option>
        ))}
      </Select>

      {showConfirm && pendingLocation && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-sm shadow-sm animate-fade-in">
          <div className="text-emerald-800">
            <span className="font-semibold">Move pin here?</span>
            <div className="text-xs text-emerald-600">
              Lat: {pendingLocation.lat.toFixed(5)}, Lng: {pendingLocation.lng.toFixed(5)}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="small" onClick={cancelDrag}>
              Cancel
            </Button>
            <Button
              size="small"
              type="primary"
              className="!bg-emerald-700 hover:!bg-emerald-800"
              onClick={confirmDrag}
            >
              Update Pin
            </Button>
          </div>
        </div>
      )}

      {hasCoordinates && (
        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-1 flex items-center justify-between">
            <span>Tip: Drag marker or click anywhere on map to adjust location</span>
            <span>
              {Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)}
            </span>
          </div>
          <LeafletMap
            lat={Number(latitude)}
            lng={Number(longitude)}
            zoom={15}
            draggable={true}
            onMarkerDragEnd={handleMarkerDragEnd}
            onMapClick={handleMapClick}
            height="360px"
          />
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
