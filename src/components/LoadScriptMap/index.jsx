import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';


function LoadScriptMap({salonList, currentLocation, mapStyle}) {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [selectedSalon, setSelectedSalon] = useState(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
          if (!scriptLoaded) {
            window.location.reload();
          }
        }, 1000); // 5 seconds timeout
    
        return () => clearTimeout(timeoutId);
      }, [scriptLoaded]);

    const handleMarkerClick = (salon) => {
        setSelectedSalon(salon);
        // const directionsService = new window.google.maps.DirectionsService();
        // directionsService.route(
        //   {
        //     origin: defaultCenter, // Replace with the current location if available
        //     destination: {
        //       lat: parseFloat(salon.latitude),
        //       lng: parseFloat(salon.longitude),
        //     },
        //     travelMode: window.google.maps.TravelMode.DRIVING,
        //   },
        //   (result, status) => {
        //     if (status === window.google.maps.DirectionsStatus.OK) {
        //       setDirections(result);
        //     } else {
        //       console.error(`error fetching directions ${result}`);
        //     }
        //   }
        // );
      };
    return (
        <LoadScript
            googleMapsApiKey={`${
              import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
            }&loading=async`}
            onLoad={() => {
              if (scriptLoaded) {
                console.clear(); // Clear console to remove previous logs
              }
              setScriptLoaded(true);
            }}
          >
            <GoogleMap
              mapContainerStyle={mapStyle}
              center={currentLocation}
              zoom={8}
            >
              {salonList &&
                salonList.map((salon) => {
                  const lat = parseFloat(salon.latitude);
                  const lng = parseFloat(salon.longitude);

                  if (isNaN(lat) || isNaN(lng)) {
                    console.error(
                      `Invalid coordinates for salon ${salon.id}: (${salon.latitude}, ${salon.longitude})`
                    );
                    return null;
                  }

                  return (
                    <MarkerF
                      key={salon.id}
                      position={{ lat, lng }}
                      onClick={() => handleMarkerClick(salon)}
                    />
                  );
                })}
              {selectedSalon && (
                <InfoWindow
                  position={{
                    lat: parseFloat(selectedSalon.latitude),
                    lng: parseFloat(selectedSalon.longitude),
                  }}
                  onCloseClick={() => setSelectedSalon(null)}
                >
                  <div>
                    <h3>{selectedSalon.name}</h3>
                    <p>{selectedSalon.address}</p>
                    <a
                      // href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSalon.latitude},${selectedSalon.longitude}`}
                      // href={`https://www.google.com/maps/dir//${selectedSalon.latitude},${selectedSalon.longitude},7z?entry=ttu`}
                      href={`https://www.google.com/maps/dir//${selectedSalon.latitude},${selectedSalon.longitude},7z?entry=ttu`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chỉ đường
                    </a>
                  </div>
                </InfoWindow>
              )}
              {/* {directions && <DirectionsRenderer directions={directions} />} */}
            </GoogleMap>
          </LoadScript>
    );
}

export default LoadScriptMap;