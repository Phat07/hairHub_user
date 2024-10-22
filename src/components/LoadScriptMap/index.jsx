// import {
//   GoogleMap,
//   InfoWindow,
//   InfoWindowF,
//   LoadScript,
//   MarkerF,
// } from "@react-google-maps/api";
// import React, { useEffect, useState } from "react";

// function LoadScriptMap({ salonList, currentLocation, mapStyle, isSalonNear }) {
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const [loadingError, setLoadingError] = useState(false);
//   const [selectedSalon, setSelectedSalon] = useState(null);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (!scriptLoaded) {
//         window.location.reload();
//       }
//     }, 1000); // 5 seconds timeout

//     return () => clearTimeout(timeoutId);
//   }, [scriptLoaded]);

//   const handleMarkerClick = (salon) => {
//     setSelectedSalon(salon);
//   };
//   return (
//     <LoadScript
//       libraries={["places"]}
//       googleMapsApiKey={`${
//         import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
//       }&loading=async`}
//       onLoad={() => {
//         if (scriptLoaded) {
//           console.clear(); // Clear console to remove previous logs
//         }
//         setScriptLoaded(true);
//       }}
//     >
//       {/* tui muốn thêm ở đây  */}
//       <GoogleMap mapContainerStyle={mapStyle} center={currentLocation} zoom={8}>
//         {salonList &&
//           salonList?.map((salon) => {
//             const lat = parseFloat(salon.latitude);
//             const lng = parseFloat(salon.longitude);

//             if (isNaN(lat) || isNaN(lng)) {
//               console.error(
//                 `Invalid coordinates for salon ${salon.id}: (${salon.latitude}, ${salon.longitude})`
//               );
//               return null;
//             }

//             return (
//               <MarkerF
//                 key={salon.id}
//                 position={{ lat, lng }}
//                 onClick={() => handleMarkerClick(salon)}
//               />
//             );
//           })}
//         {selectedSalon && (
//           <InfoWindowF
//             position={{
//               lat: parseFloat(selectedSalon.latitude),
//               lng: parseFloat(selectedSalon.longitude),
//             }}
//             onCloseClick={() => setSelectedSalon(null)}
//           >
//             <div>
//               <h3>{selectedSalon.name}</h3>
//               <p>{selectedSalon.address}</p>
//               <a
//                 // href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSalon.latitude},${selectedSalon.longitude}`}
//                 // href={`https://www.google.com/maps/dir//${selectedSalon.latitude},${selectedSalon.longitude},7z?entry=ttu`}
//                 href={`https://www.google.com/maps/dir//${selectedSalon.latitude},${selectedSalon.longitude},7z?entry=ttu`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Chỉ đường
//               </a>
//             </div>
//           </InfoWindowF>
//         )}
//         {/* {directions && <DirectionsRenderer directions={directions} />} */}
//       </GoogleMap>
//     </LoadScript>
//   );
// }

// export default LoadScriptMap;
import {
  GoogleMap,
  InfoWindow,
  InfoWindowF,
  LoadScript,
  MarkerF,
  Autocomplete,
} from "@react-google-maps/api";
import { message } from "antd";
import React, { useEffect, useState, useRef } from "react";

function LoadScriptMap({ salonList, currentLocation, mapStyle, isSalonNear }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [distance, setDistance] = useState("");
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const autocompleteRef = useRef(null);
  const [zoom, setZoom] = useState(8);
  useEffect(() => {
    if (!isSalonNear) {
      setLatLng({
        lat: null,
        lng: null,
      });
    }
  }, [isSalonNear]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!scriptLoaded) {
        window.location.reload();
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [scriptLoaded]);

  const handleMarkerClick = (salon) => {
    setSelectedSalon(salon);
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLatLng({ lat, lng });
    message.info("aaa");
    setZoom(15);
  };

  return (
    <LoadScript
      libraries={["places"]}
      googleMapsApiKey={import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY}
      onLoad={() => setScriptLoaded(true)}
    >
      <div className="relative h-full">
        {/* Google Map */}
        <GoogleMap
          mapContainerStyle={mapStyle}
          center={latLng.lat ? latLng : currentLocation}
          zoom={zoom}
          onClick={handleMapClick} // Handle click on the map
        >
          {salonList && salonList.length > 0 ? (
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
            })
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center text-xl text-gray-700">
                <p>Nhấn vào bản đồ để chọn vị trí</p>
              </div>
              {latLng.lat && latLng.lng && (
                <InfoWindowF
                  position={latLng}
                  onCloseClick={() => setLatLng({ lat: null, lng: null })}
                >
                  <div className="p-3">
                    <h3 className="font-bold text-lg">Vị trí đã chọn</h3>
                    <p className="text-sm">
                      Latitude: {latLng.lat}, Longitude: {latLng.lng}
                    </p>
                  </div>
                </InfoWindowF>
              )}
            </>
          )}

          {selectedSalon && (
            <InfoWindowF
              position={{
                lat: parseFloat(selectedSalon.latitude),
                lng: parseFloat(selectedSalon.longitude),
              }}
              onCloseClick={() => setSelectedSalon(null)}
            >
              <div className="bg-white shadow-lg rounded-lg p-4 max-w-xs">
                <h3 className="font-bold text-xl text-gray-800">
                  {selectedSalon.name}
                </h3>
                <p className="text-sm text-gray-600">{selectedSalon.address}</p>
                <a
                  href={`https://www.google.com/maps/dir//${selectedSalon.latitude},${selectedSalon.longitude},7z?entry=ttu`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 block"
                >
                  Chỉ đường
                </a>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>

        {/* Controls for distance and location input */}
        {isSalonNear && (
          <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg space-y-2">
            <input
              type="number"
              placeholder="Nhập khoảng cách (km)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Autocomplete
              onLoad={(autocomplete) =>
                (autocompleteRef.current = autocomplete)
              }
              onPlaceChanged={() => {
                const place = autocompleteRef.current.getPlace();
                console.log("place", place.geometry.location.lat());

                if (place.geometry && place.geometry.location) {
                  setZoom(15);
                  setLatLng({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  });
                }
              }}
            >
              <input
                type="text"
                placeholder="Tìm kiếm địa điểm..."
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
            </Autocomplete>
          </div>
        )}
      </div>
    </LoadScript>
  );
}

export default LoadScriptMap;
