const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEMAP || '';
export const getUserLocation = (

    onSuccess: (lat: number, lng: number, address: string, city:string) => void,
    onError?: (error: string) => void,
    lat?: number, 
    lng?: number
  ) => {
    // If lat & lng are provided, use them instead of geolocation
    const fetchLocation = (latitude: number, longitude: number) => {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address;
// extract city from address
const addressComponents = data.results[0].address_components;
const localityComponent = addressComponents.find((comp:any) =>
  comp.types.includes("administrative_area_level_3")
);
        const city=localityComponent.long_name;
        
            onSuccess(latitude, longitude, address,city);
          } else {
            onError?.("Address not found");
          }
        })
        .catch((error) => onError?.(error.message));
    };
  
    if (lat !== undefined && lng !== undefined) {
      // Use manually provided coordinates
      fetchLocation(lat, lng);
    } else if (navigator.geolocation) {
      // Use current location from GPS
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          onError?.(error.message);
        }
      );
    } else {
      onError?.("Geolocation is not supported by this browser.");
    }
  };
  