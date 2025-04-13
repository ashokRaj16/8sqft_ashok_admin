import React, { useState, useMemo, useCallback } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { MdMyLocation } from "react-icons/md";
import { IoIosClose } from "react-icons/io";

const GOOGLE_MAPS_API_KEY = "AIzaSyB4mLQjyo8whkMHMHA5mpZ4Y17dS2bjgaM"; 

interface PropertyLocationProps {
  lat?: string;
  lng?: string;
}

interface LocationState {
  lat: number;
  lng: number;
}

export default function BuilderLocation({ lat, lng }: PropertyLocationProps) {
  const parsedLat = lat ? parseFloat(lat) : 19.076;
  const parsedLng = lng ? parseFloat(lng) : 72.8777;

  const [selectedLocation, setSelectedLocation] = useState<LocationState | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized center config
  const mapCenter = useMemo(() => ({ lat: parsedLat, lng: parsedLng }), [parsedLat, parsedLng]);
  const mapOptions = useMemo(() => ({
    zoom: 14,
    center: mapCenter,
    zoomControl: true,
  }), [mapCenter]);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedLocation({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  }, []);

  const fetchPlaceSuggestions = useCallback(
    debounce((query: string) => {
      if (!query) return setSuggestions([]);

      setLoading(true);
      const service = new google.maps.places.AutocompleteService();

      service.getPlacePredictions(
        { input: query, componentRestrictions: { country: "in" } },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
          setLoading(false);
        }
      );
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchPlaceSuggestions(value);
  };

  const handleSuggestionClick = (placeId: string) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ placeId }, (results, status) => {
      if (status === "OK" && results?.[0].geometry?.location) {
        const location = results[0].geometry.location;
        setSelectedLocation({ lat: location.lat(), lng: location.lng() });
        setSearchQuery(results[0].formatted_address);
        setSuggestions([]);
      } else {
        console.error("Geocoding failed:", status);
        toast.error("Failed to get location details. Please try again.");
      }
    });
  };

  const handleGetDirections = () => {
    if (!selectedLocation) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: selectedLocation,
        destination: { lat: parsedLat, lng: parsedLng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          toast.error("Failed to fetch directions");
          console.error("Directions error:", result);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div className="shadow-custom my-2 bg-white">
        {/* Header */}
        <h2 className="font-semibold lg:text-lg border-b border-[#D9D9D9] py-2 mb-2 px-4 shadow-sm">
          Location
        </h2>

        {/* Search Input & Button */}
        <div className="px-4 ">
          <div className="flex flex-row lg:gap-4 border lg:border-none rounded px-1">
            <div className="w-full relative">
     <div className="relative">
     <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Type in place to get direction"
                className="w-full p-2 lg:border rounded-md h-10 text-sm focus:outline-none"
              />
              {searchQuery&&(<span className="absolute lg:right-2 right-0 bg-white top-1/2 -translate-y-1/2 cursor-pointer" onClick={()=>setSearchQuery("")}><IoIosClose size={20}/></span>)}
     </div>
              {suggestions.length > 0 && (
                <ul className="border rounded-md mt-1 max-h-40 overflow-y-auto bg-white shadow-lg text-sm absolute z-10 w-full">
                  {suggestions.slice(0, 3).map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      onClick={() => handleSuggestionClick(suggestion.place_id)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                      {suggestion.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={handleGetDirections}
              className="lg:text-sm lg:w-40 text-xs lg:border rounded-md hover:border-primary hover:text-primary"
              >
             <span className=" hidden lg:block"> Get Directions</span> <MdMyLocation className="lg:hidden block text-[#22222280]" size={20}/>
            </button>
          </div>
              {loading && <p className="text-sm text-gray-500">Loading suggestions...</p>}
        </div>

        {/* Map */}
        <div className="relative h-[350px] overflow-hidden p-2">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            options={mapOptions}
            onClick={handleMapClick}
          >
            {/* Property Marker */}
            <Marker position={{ lat: parsedLat, lng: parsedLng }} />

            {/* Directions Route */}
            {directions && <DirectionsRenderer directions={directions} />}
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
  // /* <div className="hidden  flex-1 gap-2">
  //           <Input
  //             value={inputValue}
  //             onChange={(e) => setInputValue(e.target.value)}
  //             placeholder="Type in place to get directions"
  //             className="flex-1"
  //           />
  //           <Button
  //             variant="outline"
  //             className="text-orange-500 border-orange-500"
  //           >
  //             Get Directions
  //           </Button>
  //         </div> */
}
