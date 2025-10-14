import React, { useState, useRef, useEffect } from "react";
import { Button, Input, Popconfirm, Select } from "antd";
import { HiLocationMarker } from "react-icons/hi";
import { CiLocationOn, CiSearch } from "react-icons/ci";
import { GoogleMap, Marker } from "@react-google-maps/api";
import type { LocationType } from "../../Types/Court";

interface AddressAutocompleteProps {
  onPlaceSelected: (data: LocationType | null) => void;
  value: LocationType;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  marginTop: "20px",
};
const AddressAutocomplete = ({
  onPlaceSelected,
  value,
}: AddressAutocompleteProps) => {
  const { latitude, longitude } = value || {};
  const [pendingLocation, setPendingLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Initialize services
  useEffect(() => {
    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      const dummyDiv = document.createElement("div");
      placesService.current = new window.google.maps.places.PlacesService(
        dummyDiv
      );
    }
  }, []);

  // Fetch autocomplete predictions
  const fetchPredictions = (value: string) => {
    if (!autocompleteService.current) return;
    autocompleteService.current.getPlacePredictions(
      { input: value },
      (preds, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && preds) {
          setPredictions(preds);
        } else {
          setPredictions([]);
        }
      }
    );
  };

  // When a prediction is selected
  const handleSelect = async (place: any) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId: place,
        fields: ["address_components", "geometry", "name"],
      },
      (result: any, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          const addressDetails = {
            state: "",
            city: "",
            postal_code: "",
            latitude:
              result.geometry && result.geometry.location
                ? result.geometry.location.lat().toString()
                : "",
            longitude:
              result.geometry && result.geometry.location
                ? result.geometry.location.lng().toString()
                : "",
          };

          for (const component of result?.address_components) {
            console.log(component, "========>component");
            const componentType = component.types[0];
            switch (componentType) {
              case "administrative_area_level_1":
                addressDetails.state = component.long_name;
                break;
              case "locality":
                addressDetails.city = component.long_name;
                break;
              case "postal_code":
                addressDetails.postal_code = component.long_name;
                break;
              default:
                break;
            }
          }

          // If city is not found, try administrative_area_level_2
          if (!addressDetails.city) {
            for (const component of result?.address_components) {
              if (component.types.includes("administrative_area_level_2")) {
                addressDetails.city = component.long_name;
                break;
              }
            }
          }

          onPlaceSelected(addressDetails);
          setInputValue(result.name || place.description);
          setPredictions([]);
        }
      }
    );
  };
  const handleClear = () => {
    setInputValue(null);
    setPredictions([]);
    onPlaceSelected(null);
  };

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setPendingLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    setShowConfirm(true);

    console.log({ lat, lng });
    // if (onPlaceSelected) {
    //   onPlaceSelected({
    //     ...value,
    //     latitude: lat.toString(),
    //     longitude: lng.toString(),
    //   });
    // }
    // Pass updated location back to parent (optional)
  };

  const confirmDrag = () => {
    if (pendingLocation) {
      if (onPlaceSelected) {
        onPlaceSelected({
          ...value,
          latitude: pendingLocation.lat.toString(),
          longitude: pendingLocation.lng.toString(),
        });
      }
    }
    setShowConfirm(false);
  };

  const cancelDrag = () => {
    setPendingLocation(null);
    setShowConfirm(false);
  };

  return (
    <div>
      <Select
        prefix={<CiSearch />}
        showSearch
        value={inputValue}
        placeholder="Enter your address"
        className="!w-full"
        onSearch={(value: string) => {
          setInputValue(value);
          fetchPredictions(value);
        }}
        onClear={handleClear}
        allowClear
        onSelect={(value) => handleSelect(value)}
        filterOption={false}
        notFoundContent={null}
      >
        {predictions.map((pred) => (
          <Select.Option key={pred?.place_id} value={pred.place_id}>
            <div className="grid grid-cols-10 gap-2">
              <CiLocationOn className="text-xl mr-2 mt-1 !col-span-1" />
              <span className="leading-[18px] !col-span-9 break-words whitespace-normal">
                {pred.description}
              </span>
            </div>
          </Select.Option>
        ))}
      </Select>
      {longitude && latitude && (
        <div>
          {showConfirm && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1001,
                width: "100%",
              }}
            >
              <Popconfirm
                title="Confirm location change?"
                onConfirm={confirmDrag}
                onCancel={cancelDrag}
                okText="Yes"
                cancelText="No"
                open={showConfirm}
              >
                <div /> {/* Popconfirm requires a child */}
              </Popconfirm>
            </div>
          )}
          <GoogleMap
            options={{
              mapTypeControl: false, // hides Satellite/Terrain toggle
              streetViewControl: false, // optional: hide Street View pegman
              fullscreenControl: false, // optional: hide fullscreen button
            }}
            mapContainerStyle={mapContainerStyle}
            center={{
              lat: Number(latitude) || 0,
              lng: Number(longitude) || 0,
            }}
            zoom={15}
          >
            <Marker
              draggable
              onDragEnd={handleMarkerDragEnd}
              position={{
                lat: Number(latitude) || 0,
                lng: Number(longitude) || 0,
              }}
            />
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
