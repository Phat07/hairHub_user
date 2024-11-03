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
// import {
//   GoogleMap,
//   InfoWindow,
//   InfoWindowF,
//   LoadScript,
//   MarkerF,
//   Autocomplete,
// } from "@react-google-maps/api";
// import { message } from "antd";
// import React, { useEffect, useState, useRef } from "react";

// function LoadScriptMap({ salonList, currentLocation, mapStyle, isSalonNear }) {
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const [selectedSalon, setSelectedSalon] = useState(null);
//   const [distance, setDistance] = useState("");
//   const [latLng, setLatLng] = useState({ lat: null, lng: null });
//   const autocompleteRef = useRef(null);
//   const [zoom, setZoom] = useState(8);
//   useEffect(() => {
//     if (!isSalonNear) {
//       setLatLng({
//         lat: null,
//         lng: null,
//       });
//     }
//   }, [isSalonNear]);
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (!scriptLoaded) {
//         window.location.reload();
//       }
//     }, 5000); // 5 seconds timeout

//     return () => clearTimeout(timeoutId);
//   }, [scriptLoaded]);

//   const handleMarkerClick = (salon) => {
//     setSelectedSalon(salon);
//   };

//   const handleMapClick = (event) => {
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();
//     setLatLng({ lat, lng });
//     message.info("aaa");
//     setZoom(15);
//   };

//   return (
//     <LoadScript
//       libraries={["places"]}
//       googleMapsApiKey={import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY}
//       onLoad={() => setScriptLoaded(true)}
//     >
//       <div className="relative h-full">
//         {/* Google Map */}
//         <GoogleMap
//           mapContainerStyle={mapStyle}
//           center={latLng.lat ? latLng : currentLocation}
//           zoom={zoom}
//           onClick={handleMapClick} // Handle click on the map
//         >
//           {salonList && salonList.length > 0 ? (
//             salonList.map((salon) => {
//               const lat = parseFloat(salon.latitude);
//               const lng = parseFloat(salon.longitude);

//               if (isNaN(lat) || isNaN(lng)) {
//                 console.error(
//                   `Invalid coordinates for salon ${salon.id}: (${salon.latitude}, ${salon.longitude})`
//                 );
//                 return null;
//               }

//               return (
//                 <MarkerF
//                   key={salon.id}
//                   position={{ lat, lng }}
//                   onClick={() => handleMarkerClick(salon)}
//                 />
//               );
//             })
//           ) : (
//             <>
//               <div className="absolute inset-0 flex items-center justify-center text-xl text-gray-700">
//                 <p>Nhấn vào bản đồ để chọn vị trí</p>
//               </div>
//               {latLng.lat && latLng.lng && (
//                 <InfoWindowF
//                   position={latLng}
//                   onCloseClick={() => setLatLng({ lat: null, lng: null })}
//                 >
//                   <div className="p-3">
//                     <h3 className="font-bold text-lg">Vị trí đã chọn</h3>
//                     <p className="text-sm">
//                       Latitude: {latLng.lat}, Longitude: {latLng.lng}
//                     </p>
//                   </div>
//                 </InfoWindowF>
//               )}
//             </>
//           )}

//           {selectedSalon && (
//             <InfoWindowF
//               position={{
//                 lat: parseFloat(selectedSalon.latitude),
//                 lng: parseFloat(selectedSalon.longitude),
//               }}
//               onCloseClick={() => setSelectedSalon(null)}
//             >
//               <div className="bg-white shadow-lg rounded-lg p-4 max-w-xs">
//                 <h3 className="font-bold text-xl text-gray-800">
//                   {selectedSalon.name}
//                 </h3>
//                 <p className="text-sm text-gray-600">{selectedSalon.address}</p>
//                 <a
//                   href={`https://www.google.com/maps/dir//${selectedSalon.latitude},${selectedSalon.longitude},7z?entry=ttu`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:underline mt-2 block"
//                 >
//                   Chỉ đường
//                 </a>
//               </div>
//             </InfoWindowF>
//           )}
//         </GoogleMap>

//         {/* Controls for distance and location input */}
//         {isSalonNear && (
//           <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
//           <input
//             type="number"
//             placeholder="Nhập khoảng cách (km)"
//             value={distance}
//             onChange={(e) => setDistance(e.target.value)}
//             className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-grow"
//           />

//           <Autocomplete
//             onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
//             onPlaceChanged={() => {
//               const place = autocompleteRef.current.getPlace();
//               if (place.geometry && place.geometry.location) {
//                 setZoom(15);
//                 setLatLng({
//                   lat: place.geometry.location.lat(),
//                   lng: place.geometry.location.lng(),
//                 });
//               }
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Tìm kiếm địa điểm..."
//               className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
//             />
//           </Autocomplete>
//         </div>

//         )}
//       </div>
//     </LoadScript>
//   );
// }

// export default LoadScriptMap;
import {
  GoogleMap,
  InfoWindowF,
  LoadScript,
  MarkerF,
  Autocomplete,
} from "@react-google-maps/api";
import { motion } from "framer-motion";
import { Modal, Button, message, Spin } from "antd";
import React, { useEffect, useState, useRef } from "react";

function LoadScriptMapModal({
  salonList,
  currentLocation,
  mapStyle,
  isSalonNear,
  salonName,
  serviceName,
  loading,
  handleSearch,
  onLocationSelect, // Callback to pass lat and lng back
}) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const autocompleteRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(); // Modal control
  const [tempLatLng, setTempLatLng] = useState({ lat: null, lng: null }); // Temporary lat/lng for modal
  const [zoom, setZoom] = useState(8);
  const [distance, setDistance] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    }, 1000); // 5 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [scriptLoaded]);
  // Handle main map marker click
  const handleMarkerClick = (salon) => {
    setSelectedSalon(salon);
  };

  // Autocomplete to trigger the modal with the map
  const handlePlaceChange = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry && place.geometry.location) {
      setTempLatLng({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      setModalVisible(true); // Open modal after selecting location
    }
  };

  // Handle map click inside modal
  const handleModalMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setTempLatLng({ lat, lng });
    setLatLng({ lat, lng });
    message.info("Vị trí đã được chọn");
    handleSearch(lat, lng, distance);
    setModalVisible(false);
  };

  // Handle modal close and send back lat/lng
  const handleModalClose = () => {
    if (tempLatLng.lat && tempLatLng.lng) {
      onLocationSelect(tempLatLng); // Pass the selected latLng back
    }
    setModalVisible(false); // Close the modal
  };
  const handlePlaceChanged = () => {
    // Validate distance before allowing place change

    const place = autocompleteRef.current.getPlace();
    if (place.geometry && place.geometry.location) {
      setZoom(15);
      setLatLng({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      setModalVisible(true);
      setErrorMessage("");
    }
  };
  return (
    <>
      {/* Main map with salonList and Autocomplete */}
      <LoadScript
        libraries={["places"]}
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
        <div className="relative h-[500px]">
          {isSalonNear && (
            <motion.div
              className="relative z-10 bottom-4 p-4 rounded-lg shadow-lg flex items-center space-x-4 w-auto overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Expanding Circle Animation */}
              <div className="absolute inset-0 flex justify-center items-center -z-10">
                <div className="animate-expand-circle bg-blue-200 rounded-full w-10 h-10" />
              </div>

              <div className="flex-none w-3/12">
                <input
                  type="number"
                  placeholder="Nhập (km)"
                  value={distance}
                  onChange={(e) => {
                    setDistance(e.target.value);
                    if (e.target.value >= 1) {
                      setErrorMessage("");
                    } else {
                      setErrorMessage(
                        "Vui lòng nhập khoảng cách tối thiểu là 1 km"
                      );
                    }
                  }}
                  className="relative border border-gray-300 rounded p-2 focus:outline-none w-full"
                />
              </div>

              <div className="flex-grow w-7/12">
                <Autocomplete
                  onLoad={(autocomplete) =>
                    (autocompleteRef.current = autocomplete)
                  }
                  onPlaceChanged={handlePlaceChanged}
                  options={{
                    componentRestrictions: { country: "VN" }, // Giới hạn trong Việt Nam
                  }}
                >
                  <input
                    type="text"
                    placeholder="Tìm kiếm địa điểm..."
                    className="border border-gray-300 rounded p-2 focus:outline-none w-full"
                    disabled={!distance || distance < 1}
                  />
                </Autocomplete>
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}
              </div>
            </motion.div>
          )}
          <GoogleMap
            mapContainerStyle={mapStyle}
            center={latLng.lat ? latLng : currentLocation}
            zoom={zoom}
            onClick={() => {}}
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
              <div className="absolute inset-0 flex items-center justify-center text-xl text-gray-700">
                <p>Không tồn tại salon nào</p>
              </div>
            )}

            {selectedSalon && (
              <InfoWindowF
                position={{
                  lat: parseFloat(selectedSalon.latitude),
                  lng: parseFloat(selectedSalon.longitude),
                }}
                onCloseClick={() => setSelectedSalon(null)}
              >
                <div className="p-2">
                  <h3 className="text-lg md:text-xl">{selectedSalon.name}</h3>
                  <p className="text-sm md:text-base">
                    {selectedSalon.address}
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir//${selectedSalon.latitude},${selectedSalon.longitude},7z?entry=ttu`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Chỉ đường
                  </a>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>

          {/* Autocomplete input */}
          {/* {isSalonNear && (
            <motion.div
              className="absolute top-4 left-4 z-10 bg-white bg-opacity-30 p-4 rounded-lg shadow-lg flex items-center space-x-4 w-auto overflow-hidden"
              initial={{ opacity: 0, y: -20 }} // Initial state
              animate={{ opacity: 1, y: 0 }} // Animate to this state
              transition={{ duration: 0.3 }} // Transition duration
            >
              <div className="flex-none w-3/12">
                <input
                  type="number"
                  placeholder="Nhập (km)"
                  value={distance}
                  onChange={(e) => {
                    setDistance(e.target.value);
                    if (e.target.value >= 1) {
                      setErrorMessage(''); // Clear error message if distance is valid
                    }else{
                      setErrorMessage('Vui lòng nhập khoảng cách tối thiểu là 1 km'); // Clear error message if distance is valid
                    }
                  }}
                  className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                />
              </div>

              <div className="flex-grow w-7/12">
                <Autocomplete
                  onLoad={(autocomplete) =>
                    (autocompleteRef.current = autocomplete)
                  }
                  //  onPlaceChanged={() => {
                  //    const place = autocompleteRef.current.getPlace();
                  //    if (place.geometry && place.geometry.location) {
                  //      setZoom(15);
                  //      setLatLng({
                  //        lat: place.geometry.location.lat(),
                  //        lng: place.geometry.location.lng(),
                  //      });
                  //      setModalVisible(true);
                  //    }
                  //  }}
                  onPlaceChanged={handlePlaceChanged}
                >
                  <input
                    type="text"
                    placeholder="Tìm kiếm địa điểm..."
                    className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    disabled={!distance || distance < 1}
                  />
                </Autocomplete>
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-2">{errorMessage}</p> // Show error message
                )}
              </div>
            </motion.div>
          )} */}
        </div>
        <Modal
          title={null}
          visible={modalVisible}
          onOk={handleModalClose}
          onCancel={() => setModalVisible(false)}
          closable={false}
          footer={null}
          width={800}
        >
          <Spin className="custom-spin" spinning={loading}>
            <div className="relative h-[500px]">
              <GoogleMap
                mapContainerStyle={{ height: "100%", width: "100%" }}
                center={latLng}
                zoom={15}
                onClick={handleModalMapClick}
              >
                {tempLatLng.lat && tempLatLng.lng && (
                  <MarkerF position={tempLatLng} />
                )}
              </GoogleMap>
            </div>
          </Spin>
        </Modal>
      </LoadScript>

      {/* Modal with map to select lat/lng */}
    </>
  );
}

export default LoadScriptMapModal;
