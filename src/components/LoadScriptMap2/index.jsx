import {
  GoogleMap,
  InfoWindowF,
  LoadScript,
  MarkerF,
  Autocomplete,
} from "@react-google-maps/api";
import { motion } from "framer-motion";
import { Modal, Button, message, Spin, Input } from "antd";
import React, { useEffect, useState, useRef } from "react";
import styles from "../../css/SearchLocation.module.css";

function LoadScriptMapModal({
  salonList,
  currentLocation,
  mapStyle,
  isSalonNear,
  setIsSalonNear,
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
  const inputRef = useRef(null);
  console.log("currentLocation", currentLocation);

  const [modalVisible, setModalVisible] = useState(); // Modal control
  const [tempLatLng, setTempLatLng] = useState({ lat: null, lng: null }); // Temporary lat/lng for modal
  const [zoom, setZoom] = useState(8);
  const [distance, setDistance] = useState(20);
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   if (!isSalonNear) {
  //     setLatLng({
  //       lat: null,
  //       lng: null,
  //     });
  //   }
  // }, [isSalonNear]);
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
    if (!distance || distance < 1) {
      message.warning("Hãy nhập khoảng cách trước !");
      return;
    }
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setTempLatLng({ lat, lng });
    setLatLng({ lat, lng });
    setZoom(10);
    message.info("Vị trí đã được chọn");
    handleSearch(lat, lng, distance);
    setIsSalonNear();
  };

  const handleCancelSearch = () => {
    handleSearch(null, null, null);
    setTempLatLng({ lat: null, lng: null });
    setLatLng({
      lat: 10.8413699483297, // Vĩ độ của Đại học FPT HCM
      lng: 106.80988299540918, // Kinh độ của Đại học FPT HCM
    });
    setZoom(8);
    setIsSalonNear();
    if (inputRef.current) {
      inputRef.current.value = ""; // Làm rỗng giá trị của input
    }
  };

  // Handle modal close and send back lat/lng
  const handleModalClose = () => {
    if (tempLatLng.lat && tempLatLng.lng) {
      onLocationSelect(tempLatLng); // Pass the selected latLng back
    }
    setIsSalonNear(); // Close the modal
  };
  const handlePlaceChanged = () => {
    // Validate distance before allowing place change

    const place = autocompleteRef.current.getPlace();
    if (place.geometry && place.geometry.location) {
      setZoom(10);
      setLatLng({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      // setTempLatLng({
      //   lat: place.geometry.location.lat(),
      //   lng: place.geometry.location.lng(),
      // });
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
          <GoogleMap
            mapContainerStyle={mapStyle}
            center={latLng.lat ? latLng : currentLocation}
            zoom={zoom}
            onClick={() => {}}
            options={{
              disableDefaultUI: true, // Vô hiệu hóa các UI mặc định
              zoomControl: true, // Hiển thị điều khiển zoom
              streetViewControl: false, // Ẩn điều khiển street view
              mapTypeControl: false, // Ẩn điều khiển loại bản đồ
            }}
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
          title={"Hãy nhập khoảng cách và chọn vị trí bạn muốn tìm kiếm"}
          visible={isSalonNear}
          onOk={handleModalClose}
          onCancel={() => setIsSalonNear()}
          closable={false}
          footer={null}
          width={800}
        >
          <Spin className="custom-spin" spinning={loading}>
            <div className="relative h-[500px]">
              {/* Input Fields */}
              <div className={styles.searchContainer}>
                <motion.div
                  className={styles.searchContainer1}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Expanding Circle Animation */}
                  <div className={styles.inputContainer}>
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
                      style={{ borderColor: "gray" }}
                      className={styles.distanceInput}
                    />
                  </div>

                  <div className={styles.inputContainer}>
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
                        ref={inputRef}
                        placeholder="Tìm kiếm địa điểm..."
                        className={styles.locationInput}
                        disabled={!distance || distance < 1}
                        style={{ borderColor: "gray" }}
                      />
                    </Autocomplete>
                  </div>

                  {tempLatLng.lat && tempLatLng.lng && (
                    <div>
                      <Button
                        type="text"
                        size="large"
                        success
                        className={styles.cancelButton}
                        onClick={() => handleCancelSearch()}
                      >
                        Hủy tìm kiếm
                      </Button>
                    </div>
                  )}
                </motion.div>
                {errorMessage && (
                  <p
                    className={styles.errorMessage}
                    style={{ marginBottom: "0px" }}
                  >
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Google Map */}
              <GoogleMap
                mapContainerStyle={{ height: "100%", width: "100%" }}
                center={latLng.lat ? latLng : currentLocation}
                zoom={15}
                onClick={handleModalMapClick}
                options={{
                  disableDefaultUI: true, // Vô hiệu hóa các UI mặc định
                  zoomControl: true, // Hiển thị điều khiển zoom
                  streetViewControl: false, // Ẩn điều khiển street view
                  mapTypeControl: false, // Ẩn điều khiển loại bản đồ
                }}
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
