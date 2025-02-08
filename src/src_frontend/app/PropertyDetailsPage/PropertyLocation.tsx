import React, { useState, useMemo, useCallback, useEffect } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyB4mLQjyo8whkMHMHA5mpZ4Y17dS2bjgaM";

interface LocationItem {
  name: string;
  distance: string;
}

interface LocationListProps {
  title: string;
  locations: LocationItem[];
}

const LocationList: React.FC<LocationListProps> = ({ title, locations }) => {
  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <h3 className="text-orange-500 text-sm font-semibold">{title}</h3>
      <div className="mt-2 space-y-3">
        {locations.length > 0 ? (
          locations.map((location, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-sm text-gray-600"
            >
              <span>{location.name}</span>
              <span>{location.distance}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No locations found.</p>
        )}
      </div>
    </div>
  );
};

interface PropertyLocationProps {
  lat: string | undefined;
  lng: string | undefined;
}

export default function PropertyLocation({ lat, lng }: PropertyLocationProps) {
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("transit");
  const [nearbyLocations, setNearbyLocations] = useState<LocationItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [address, setAddress] = useState<string>("");

  // Parse lat and lng as numbers
  const parsedLat = lat ? parseFloat(lat) : null;
  const parsedLng = lng ? parseFloat(lng) : null;

  const mapCenter = useMemo(() => {
    return {
      lat: parsedLat || 19.076, // Default to Mumbai if lat/lng are not provided
      lng: parsedLng || 72.8777,
    };
  }, [parsedLat, parsedLng]);

  const mapOptions = useMemo(
    () => ({
      zoom: 14,
      center: mapCenter,
    }),
    [mapCenter]
  );

  // Geocode the location to get a human-readable address
  useEffect(() => {
    if (parsedLat && parsedLng) {
      // Ensure google is available before accessing it
      if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder(); // Access google from window
        const latLng = new window.google.maps.LatLng(parsedLat, parsedLng);
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
            setAddress(results[0].formatted_address); // Ensure results is not null
          } else {
            setAddress("Address not found");
          }
        });
      } else {
        console.error("Google Maps API not loaded.");
      }
    }
  }, [parsedLat, parsedLng]);
  

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedLocation({ lat, lng });
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div className="max-w-screen-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Property Location and Nearby
        </h2>

        {/* Display the User Location Address */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <label className="text-sm text-gray-600">
            Your Location: {address}
          </label>
        </div>

        {/* Map */}
        <div className="relative h-[300px] w-[60vw] rounded-lg overflow-hidden border border-gray-200">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            options={mapOptions}
            onClick={handleMapClick}
          >
            {/* Show a marker at the current location */}
            {parsedLat && parsedLng && (
              <Marker position={{ lat: parsedLat, lng: parsedLng }} />
            )}

            {/* Show a marker if the user clicks on the map */}
            {selectedLocation && <Marker position={selectedLocation} />}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
}


// {/* Tabs */}
// <Tabs  value={activeTab} onValueChange={setActiveTab} className="hidden mb-6">
// <TabsList className="w-full flex justify-between">
//   <TabsTrigger value="transit">Transit</TabsTrigger>
//   <TabsTrigger value="essentials">Essentials</TabsTrigger>
//   <TabsTrigger value="utility">Utility</TabsTrigger>
// </TabsList>

// <TabsContent value="transit">
//   <LocationList title="Nearby Transit Locations" locations={nearbyLocations} />
// </TabsContent>
// <TabsContent value="essentials">
//   <LocationList title="Nearby Essentials" locations={nearbyLocations} />
// </TabsContent>
// <TabsContent value="utility">
//   <LocationList title="Nearby Utilities" locations={nearbyLocations} />
// </TabsContent>
// </Tabs>
{
  /* <div className="hidden  flex-1 gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type in place to get directions"
              className="flex-1"
            />
            <Button
              variant="outline"
              className="text-orange-500 border-orange-500"
            >
              Get Directions
            </Button>
          </div> */
}
