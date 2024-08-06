import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  Select,
  Empty,
  Button,
  message,
  Modal,
  List,
  Pagination,
  Image,
  Input,
  Spin,
} from "antd";
import { CiLocationOn } from "react-icons/ci";
import axios from "axios";
// import Loader from "../components/Loader";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";

import "../css/baber.css";
import { SalonInformationServices } from "../services/salonInformationServices";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getDistance } from "geolib";
import { motion } from "framer-motion";
import { SearchOutlined } from "@ant-design/icons";
import HeaderUnAuth from "../components/HeaderUnAuth";

const mapContainerStyle = {
  height: "500px",
  width: "850px",
};
const responsiveMapContainerStyle = {
  "@media (max-width: 768px)": {
    height: "300px", // Adjust height for smaller screens
    width: "50px", // Full width for smaller screens
  },
  "@media (max-width: 480px)": {
    height: "200px", // Further adjustment for very small screens
    width: "50px", // Full width for very small screens
  },
};
const combinedMapContainerStyle = {
  ...mapContainerStyle,
  ...responsiveMapContainerStyle,
};

const defaultCenter = {
  lat: 10.8231, // Default to Ho Chi Minh City
  lng: 106.6297,
};
const vietnamProvinces = [
  { name: "Hà Nội", lat: 21.0285, lng: 105.8542 },
  { name: "Hồ Chí Minh", lat: 10.8231, lng: 106.6297 },
  { name: "Đà Nẵng", lat: 16.0544, lng: 108.2022 },
  { name: "Hải Phòng", lat: 20.8449, lng: 106.6881 },
  { name: "Cần Thơ", lat: 10.0452, lng: 105.7469 },
  { name: "An Giang", lat: 10.5216, lng: 105.1259 },
  { name: "Bà Rịa - Vũng Tàu", lat: 10.5417, lng: 107.2429 },
  { name: "Bắc Giang", lat: 21.273, lng: 106.1946 },
  { name: "Bắc Kạn", lat: 22.1497, lng: 105.834 },
  { name: "Bạc Liêu", lat: 9.2853, lng: 105.7247 },
  { name: "Bắc Ninh", lat: 21.186, lng: 106.0763 },
  { name: "Bến Tre", lat: 10.241, lng: 106.3758 },
  { name: "Bình Định", lat: 13.782, lng: 109.219 },
  { name: "Bình Dương", lat: 11.1731, lng: 106.6666 },
  { name: "Bình Phước", lat: 11.7512, lng: 106.7235 },
  { name: "Bình Thuận", lat: 11.0906, lng: 108.0721 },
  { name: "Cà Mau", lat: 9.1796, lng: 105.15 },
  { name: "Cao Bằng", lat: 22.6668, lng: 106.257 },
  { name: "Đắk Lắk", lat: 12.71, lng: 108.2378 },
  { name: "Đắk Nông", lat: 12.2549, lng: 107.6098 },
  { name: "Điện Biên", lat: 21.386, lng: 103.023 },
  { name: "Đồng Nai", lat: 10.9447, lng: 106.8244 },
  { name: "Đồng Tháp", lat: 10.5359, lng: 105.654 },
  { name: "Gia Lai", lat: 13.8074, lng: 108.1094 },
  { name: "Hà Giang", lat: 22.7656, lng: 104.9113 },
  { name: "Hà Nam", lat: 20.5835, lng: 105.9229 },
  { name: "Hà Tĩnh", lat: 18.355, lng: 105.8877 },
  { name: "Hải Dương", lat: 20.938, lng: 106.3161 },
  { name: "Hậu Giang", lat: 9.784, lng: 105.4701 },
  { name: "Hòa Bình", lat: 20.8133, lng: 105.3376 },
  { name: "Hưng Yên", lat: 20.6468, lng: 106.0511 },
  { name: "Khánh Hòa", lat: 12.2586, lng: 109.0526 },
  { name: "Kiên Giang", lat: 10.0159, lng: 105.0809 },
  { name: "Kon Tum", lat: 14.3545, lng: 107.9843 },
  { name: "Lai Châu", lat: 22.3871, lng: 103.4669 },
  { name: "Lâm Đồng", lat: 11.5753, lng: 107.855 },
  { name: "Lạng Sơn", lat: 21.8526, lng: 106.7615 },
  { name: "Lào Cai", lat: 22.338, lng: 104.1487 },
  { name: "Long An", lat: 10.6084, lng: 106.6291 },
  { name: "Nam Định", lat: 20.4375, lng: 106.1746 },
  { name: "Nghệ An", lat: 18.8066, lng: 105.6813 },
  { name: "Ninh Bình", lat: 20.2506, lng: 105.9745 },
  { name: "Ninh Thuận", lat: 11.577, lng: 108.98 },
  { name: "Phú Thọ", lat: 21.3191, lng: 105.2083 },
  { name: "Phú Yên", lat: 13.0884, lng: 109.0929 },
  { name: "Quảng Bình", lat: 17.6103, lng: 106.3487 },
  { name: "Quảng Nam", lat: 15.5394, lng: 108.0191 },
  { name: "Quảng Ngãi", lat: 15.1205, lng: 108.7923 },
  { name: "Quảng Ninh", lat: 21.0042, lng: 107.2925 },
  { name: "Quảng Trị", lat: 16.7416, lng: 107.1855 },
  { name: "Sóc Trăng", lat: 9.6036, lng: 105.9805 },
  { name: "Sơn La", lat: 21.328, lng: 103.9144 },
  { name: "Tây Ninh", lat: 11.3545, lng: 106.1472 },
  { name: "Thái Bình", lat: 20.4463, lng: 106.3361 },
  { name: "Thái Nguyên", lat: 21.592, lng: 105.8442 },
  { name: "Thanh Hóa", lat: 19.8082, lng: 105.7764 },
  { name: "Thừa Thiên Huế", lat: 16.4498, lng: 107.5624 },
  { name: "Tiền Giang", lat: 10.4493, lng: 106.342 },
  { name: "Trà Vinh", lat: 9.9366, lng: 106.3442 },
  { name: "Tuyên Quang", lat: 21.823, lng: 105.213 },
  { name: "Vĩnh Long", lat: 10.2537, lng: 105.9721 },
  { name: "Vĩnh Phúc", lat: 21.3089, lng: 105.6049 },
  { name: "Yên Bái", lat: 21.7229, lng: 104.9113 },
];
const Loader = () => <Spin size="large" />;
function SystemBarberPage(props) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [salonList, setSalonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentLocationUser, setCurrentLocationUser] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const locationSalon = searchParams.get("location");
  const servicesName = searchParams.get("servicesName");
  const salonName = searchParams.get("salonName");
  const [searchTerm, setSearchTerm] = useState(salonName || "");
  const [selectedProvince, setSelectedProvince] = useState(
    locationSalon || "Tỉnh/Thành phố"
  );
  // useEffect(() => {
  //   SalonInformationServices.getAllSalonInformation(currentPage, pageSize)
  //     .then((res) => {
  //       // window.location.reload();
  //       setLoading(false);
  //       setSalonList(res.data.items);
  //       setTotalPages(res.data.totalPages);
  //     })
  //     .catch((err) => {
  //       console.log(err, "errors");
  //     });
  // }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!scriptLoaded) {
        window.location.reload();
      }
    }, 1000); // 5 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [scriptLoaded]);

  useEffect(() => {
    setLoading(true);
    if (!locationSalon && !salonName) {
      setCurrentLocationUser("");
      SalonInformationServices.getAllSalonInformation(currentPage, pageSize)
        .then((res) => {
          setLoading(false);
          setSalonList(res.data.items);
          setTotalPages(res.data.totalPages);
        })
        .catch((err) => {
          console.log(err, "errors");
        });
    } else {
      setCurrentLocationUser("");
      SalonInformationServices.getAllSalonInformationByAddressOrSalonName(
        servicesName ? servicesName : null,
        locationSalon ? locationSalon : null,
        salonName ? salonName : null,
        currentPage,
        pageSize
      ).then((res) => {
        setLoading(false);
        console.log("ressFound", res);
        setSalonList(res.data.items);
        setTotalPages(res.data.totalPages);
      });
    }
  }, [salonName, locationSalon, currentPage, pageSize]);

  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tinh_tp.json"
      )
      .then((response) => {
        const mapper = Object.values(response.data).map((e) => {
          return { code: e.code, value: e.name, label: e.name };
        });
        setProvinces(mapper);
      })
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(
          "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/quan_huyen.json"
        )
        .then((response) => {
          const districtsData = Object.values(response.data).filter(
            (district) => district.path.includes(selectedProvince)
          );
          const mapper = districtsData.map((e) => {
            return { value: e?.name, label: e?.name };
          });
          setDistricts(mapper);
        })
        .catch((error) => console.error("Error fetching districts:", error));
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(
          "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/xa_phuong.json"
        )
        .then((response) => {
          const wardsData = Object.values(response.data).filter(
            (ward) => ward.parent_code === selectedDistrict
          );
          setWards(wardsData);
        })
        .catch((error) => console.error("Error fetching wards:", error));
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const handleChange = (value) => {
    setLoading(true);
    const province = vietnamProvinces.find(
      (province) => province.name === value
    );
    if (province) {
      setCurrentLocation({ lat: province.lat, lng: province.lng });
    } else {
      setCurrentLocation(defaultCenter); // Nếu không tìm thấy, sử dụng mặc định
    }
    if (searchTerm || salonName) {
      searchParams.delete("salonName");
      navigate(`/system_shop?location=${value}&salonName=${salonName}`);
    }

    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
    let servicesName = "";
    let locationSalon = value;
    SalonInformationServices.getAllSalonInformationByAddressOrSalonName(
      servicesName || null,
      locationSalon || null,
      salonName || null,
      currentPage,
      pageSize
    ).then((res) => {
      navigate(`/system_shop?location=${value}`);
      setLoading(false);
      console.log("ressFound", res);
      setSalonList(res.data.items);
      setTotalPages(res.data.totalPages);
    });
  };

  const handleChangeDistrict = (value) => {
    setSelectedDistrict(value);
  };
  const handleMarkerClick = (salon) => {
    setSelectedSalon(salon);
  };
  const handleSearch = async () => {
    document.body.style.overflow = "hidden";
    Modal.confirm({
      title: "Bật vị trí hiện tại",
      content: "Bạn có muốn cho phép truy cập vào vị trí của bạn?",
      async onOk() {
        if ("geolocation" in navigator) {
          setLoading(true);
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;
              const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
                import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
              }`;

              try {
                const res = await fetch(url);
                const data = await res.json();

                if (data.status === "OK") {
                  const address = data.results[0].formatted_address;
                  setCurrentLocationUser(address);
                  message.success("Cảm ơn bạn đã kích hoạt dịch vụ định vị.");
                  const salonRes =
                    await SalonInformationServices.getAllSalonInformationNotPaging();

                  if (salonRes && salonRes.data) {
                    const salonsWithDistance = salonRes.data.map((salon) => ({
                      ...salon,
                      distance: getDistance(
                        { latitude, longitude },
                        {
                          latitude: parseFloat(salon.latitude),
                          longitude: parseFloat(salon.longitude),
                        }
                      ),
                    }));

                    // Sort salons by distance
                    salonsWithDistance.sort((a, b) => a.distance - b.distance);

                    // Filter salons within a certain distance (e.g., 10 km)
                    const nearbySalons = salonsWithDistance.filter(
                      (salon) => salon.distance <= 10000
                    );

                    // Set the salon list to display the markers of nearby salons
                    setSalonList(nearbySalons);
                  }
                } else {
                  message.error("Không thể lấy được vị trí!");
                }
              } catch (error) {
                // console.error("Error fetching location or salon data:", error);
                message.error(
                  "Đã xảy ra lỗi khi lấy vị trí hoặc dữ liệu salon."
                );
              } finally {
                setLoading(false);
                document.body.style.overflow = "";
              }
            },
            (error) => {
              message.error("Bạn đã từ chối quyền truy cập vị trí!");
              document.body.style.overflow = "";
            }
          );
        } else {
          message.error(
            "Định vị địa lý không được trình duyệt của bạn hỗ trợ."
          );
          document.body.style.overflow = "";
        }
      },
      onCancel() {
        message.error("Bạn đã từ chối quyền truy cập vị trí.");
        document.body.style.overflow = "";
      },
    });
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleFoundBaber = async () => {
    searchParams.delete("salonName");
    searchParams.delete("location");
    if (!searchTerm) {
      message.warning("Vui lòng điền tên salon bạn muốn tìm");
      return;
    }
    if (!searchTerm) {
      searchParams.set("location", locationSalon);
    } else if (!locationSalon) {
      searchParams.set("salonName", searchTerm);
    } else {
      searchParams.set("salonName", searchTerm);
      searchParams.set("location", locationSalon);
    }
    navigate(`/system_shop?${searchParams.toString()}`);
  };
  const [mapStyle, setMapStyle] = useState({
    height: "500px",
    width: "850px",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setMapStyle({ height: "250px", width: "100%" });
      } else if (window.innerWidth <= 768) {
        setMapStyle({ height: "300px", width: "100%" });
      } else {
        setMapStyle({ height: "500px", width: "850px" });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    // <div className="system-salon__container">
    //   <div className="flex justify-between">
    //     <div class="left-content text-left">
    //       <Button type="primary" onClick={handleSearch}>
    //         <>Tìm salon gần bạn</>
    //       </Button>
    //     </div>
    //     <div class="flex right-content text-right mr-5 mt-2">
    //       <div className="mr-3 text-center">
    //         <Select
    //           value={selectedProvince || "Tỉnh/Thành phố"}
    //           style={{ width: 200 }}
    //           onChange={handleChange}
    //           options={provinces}
    //         />
    //       </div>
    //       <div className="text-center">
    //         <Select
    //           value={selectedDistrict || "Quận/Huyện"}
    //           style={{ width: 200 }}
    //           onChange={handleChangeDistrict}
    //           options={selectedProvince ? districts : <Empty />}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="flex justify-between mt-5">
    //     <div>
    //       <div>
    //         <motion.div
    //           variants={{
    //             hidden: { y: "-100vh", opacity: 0 },
    //             visible: {
    //               y: "-1px",
    //               opacity: 1,
    //               transition: {
    //                 delay: 0.5,
    //                 type: "spring",
    //                 stiffness: 30,
    //               },
    //             },
    //           }}
    //           initial="hidden"
    //           animate="visible"
    //         >
    //           <Input
    //             prefix={<SearchOutlined />}
    //             placeholder="Nhập tên tiệm baber"
    //             style={{
    //               width: "80%",
    //             }}
    //             size="large"
    //             className="search-input"
    //             value={searchTerm}
    //             onChange={(e) => setSearchTerm(e.target.value)}
    //           />
    //           <Button
    //             type="primary"
    //             style={{
    //               marginTop: "8px",
    //               width: "80%",
    //               marginBottom: "16px",
    //             }}
    //             onClick={handleFoundBaber}
    //           >
    //             Tìm kiếm baber
    //           </Button>
    //         </motion.div>
    //       </div>
    //       <Spin spinning={loading}>
    //         <List
    //           itemLayout="horizontal"
    //           dataSource={salonList}
    //           renderItem={(salon) => (
    //             <List.Item>
    //               <img
    //                 src={salon.img}
    //                 alt={salon.name}
    //                 style={{
    //                   width: "80px",
    //                   height: "80px",
    //                   marginRight: "20px",
    //                 }}
    //               />
    //               <div>
    //                 <h4 style={{ margin: "0", marginBottom: "8px" }}>
    //                   {salon.name}
    //                 </h4>
    //                 <p style={{ margin: "0" }}>{salon.address}</p>
    //                 <div>
    //                   <Button
    //                     size="small"
    //                     className="mr-2"
    //                     onClick={() => navigate(`/salon_detail/${salon.id}`)}
    //                   >
    //                     Đặt lịch
    //                   </Button>
    //                   <Button
    //                     size="small"
    //                     onClick={() => {
    //                       navigator.geolocation.getCurrentPosition(
    //                         (position) => {
    //                           const { latitude, longitude } = position.coords;
    //                           window.open(
    //                             `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${salon.latitude},${salon.longitude}`,
    //                             "_blank"
    //                           );
    //                         }
    //                       );
    //                     }}
    //                   >
    //                     Chỉ đường
    //                   </Button>
    //                 </div>
    //               </div>
    //             </List.Item>
    //           )}
    //           locale={{
    //             emptyText: (
    //               <Empty
    //                 description={
    //                   currentLocationUser
    //                     ? "Không có salon nào gần bạn"
    //                     : "Không có salon nào"
    //                 }
    //               />
    //             ),
    //           }}
    //         />
    //         <Pagination
    //           current={currentPage}
    //           total={totalPages}
    //           pageSize={pageSize}
    //           onChange={handlePageChange}
    //         />
    //       </Spin>
    //     </div>
    //     <div className="ml-5">
    //       <LoadScript
    //         // googleMapsApiKey={
    //         //   import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
    //         // }
    //         googleMapsApiKey={`${
    //           import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
    //         }&loading=async`}
    //         onLoad={() => {
    //           if (scriptLoaded) {
    //             console.clear(); // Clear console to remove previous logs
    //           }
    //           setScriptLoaded(true);
    //         }}
    //       >
    //         {/* {scriptLoaded ? ( */}
    //         {/* {salonList ? ( */}
    //         <GoogleMap
    //           mapContainerStyle={mapContainerStyle}
    //           center={currentLocation}
    //           zoom={8}
    //         >
    //           {/* {salonList.map((salon) => (
    //                 <Marker
    //                   key={salon.id}
    //                   position={{
    //                     lat: parseFloat(salon.latitude),
    //                     lng: parseFloat(salon.longitude),
    //                   }}
    //                   // icon={{
    //                   //   url: salon.img, // URL của hình ảnh salon
    //                   //   scaledSize: new window.google.maps.Size(50, 50), // kích thước hình ảnh marker
    //                   //   origin: new window.google.maps.Point(0.25, 0), // gốc của hình ảnh
    //                   //   anchor: new window.google.maps.Point(25, 25) // vị trí neo của hình ảnh
    //                   // }}
    //                   onClick={() => handleMarkerClick(salon)}
    //                 />
    //               ))} */}
    //           {salonList &&
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
    //             })}
    //           {selectedSalon && (
    //             <InfoWindow
    //               position={{
    //                 lat: parseFloat(selectedSalon.latitude),
    //                 lng: parseFloat(selectedSalon.longitude),
    //               }}
    //               onCloseClick={() => setSelectedSalon(null)}
    //             >
    //               <div>
    //                 <h3>{selectedSalon.name}</h3>
    //                 <p>{selectedSalon.address}</p>
    //                 <a
    //                   href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSalon.latitude},${selectedSalon.longitude}`}
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                 >
    //                   Chỉ đường
    //                 </a>
    //               </div>
    //             </InfoWindow>
    //           )}
    //         </GoogleMap>
    //         {/* ) : (
    //             <Loader />
    //           )} */}
    //         {/* ) : (
    //             <Loader />
    //           )} */}
    //       </LoadScript>
    //     </div>
    //   </div>
    // </div>
    <div className="system-salon__container">
      <div className="flex justify-between">
        <div className="left-content text-left button-container">
          <Button type="primary" onClick={handleSearch}>
            <>Tìm salon gần bạn</>
          </Button>
          <Select
            value={selectedProvince || "Tỉnh/Thành phố"}
            style={{ width: 200 }}
            onChange={handleChange}
            options={provinces}
          />

          <Select
            value={selectedDistrict || "Quận/Huyện"}
            style={{ width: 200 }}
            onChange={handleChangeDistrict}
            options={selectedProvince ? districts : <Empty />}
          />
        </div>
      </div>
      <div className="list-map-container mt-5">
        <div>
          <motion.div
            variants={{
              hidden: { y: "-100vh", opacity: 0 },
              visible: {
                y: "-1px",
                opacity: 1,
                transition: {
                  delay: 0.5,
                  type: "spring",
                  stiffness: 30,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <Input
              prefix={<SearchOutlined />}
              placeholder="Nhập tên tiệm baber"
              style={{
                width: "80%",
              }}
              size="large"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              type="primary"
              style={{
                marginTop: "8px",
                width: "80%",
                marginBottom: "16px",
              }}
              onClick={handleFoundBaber}
            >
              Tìm kiếm baber
            </Button>
          </motion.div>
          <Spin spinning={loading}>
            <List
              itemLayout="horizontal"
              dataSource={salonList}
              renderItem={(salon) => (
                <List.Item
                  className="salon-list-item"
                  style={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <img src={salon.img} alt={salon.name} className="salon-img" />
                  <div className="salon-details">
                    <h4 style={{ margin: "0", marginBottom: "8px" }}>
                      {salon.name}
                    </h4>
                    <p style={{ margin: "0" }}>{salon.address}</p>
                    <div>
                      <Button
                        size="small"
                        className="mr-2"
                        onClick={() => navigate(`/salon_detail/${salon.id}`)}
                      >
                        Đặt lịch
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              const { latitude, longitude } = position.coords;
                              window.open(
                                `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${salon.latitude},${salon.longitude}`,
                                "_blank"
                              );
                            }
                          );
                        }}
                      >
                        Chỉ đường
                      </Button>
                    </div>
                  </div>
                </List.Item>
              )}
              locale={{
                emptyText: (
                  <Empty
                    description={
                      currentLocationUser
                        ? "Không có salon nào gần bạn"
                        : "Không có salon nào"
                    }
                  />
                ),
              }}
            />
            <Pagination
              current={currentPage}
              total={totalPages}
              pageSize={pageSize}
              onChange={handlePageChange}
              style={{ display: "flex", justifyContent: "center" }}
            />
          </Spin>
        </div>
        <div className="ml-5">
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
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSalon.latitude},${selectedSalon.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chỉ đường
                    </a>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}

export default SystemBarberPage;
