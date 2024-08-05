// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Avatar,
//   Descriptions,
//   message,
//   Typography,
//   Button,
//   Space,
// } from "antd";
// import { UserOutlined } from "@ant-design/icons";
// import { AccountServices } from "../services/accountServices";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import "../css/SalonOwnerAccountPage.css";

// function SalonOwnerAccountPage() {
//   const userName = useSelector((state) => state.ACCOUNT.userName);
//   const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
//   const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
//   const uid = useSelector((state) => state.ACCOUNT.uid);

//   const [salonData, setSalonData] = useState({});

//   useEffect(() => {
//     AccountServices.GetInformationAccount(uid)
//       .then((res) => {
//         setSalonData(res.data);
//       })
//       .catch((err) => {
//         message.error("Can not get your salon details!");
//       });
//   }, [uid]);

//   const handleReload = () => {
//     window?.location?.reload();
//   };

//   return (
//     <div className="salon-owner-account">
//       {uid ? (
//         <Card className="salon-card">
//           <Avatar
//             src={salonData.img || <UserOutlined />}
//             size={100}
//             className="salon-avatar"
//           />
//           <Descriptions className="salon-info" column={1}>
//             <Descriptions.Item>
//               <Typography.Text strong>{salonData?.fullName}</Typography.Text>
//             </Descriptions.Item>
//             <Descriptions.Item>{salonData?.phone}</Descriptions.Item>
//             <Descriptions.Item>{salonData?.email}</Descriptions.Item>
//           </Descriptions>
//           <div className="salon-buttons">
//             {idOwner && (
//               <>
//                 <Link to="/salon_report">
//                   <Button type="primary">Danh sách báo cáo của bạn</Button>
//                 </Link>
//                 <Link to="/dashboardTransaction">
//                   <Button type="primary">Thống kê doanh thu</Button>
//                 </Link>
//               </>
//             )}
//             {idCustomer && (
//               <>
//                 <Link to="/customer_report">
//                   <Button type="primary">Danh sách báo cáo của bạn</Button>
//                 </Link>
//                 {/* <Link to="/dashboardTransaction"> */}
//                   <Button onClick={handleScan} type="primary">Bật quét Qr</Button>
//                 {/* </Link> */}
//               </>
//             )}
//           </div>
//         </Card>
//       ) : (
//         <div className="salon-reload">
//           <Space direction="vertical">
//             <Typography.Title>Your account is not found!</Typography.Title>
//             <Button style={{ width: "100%" }} onClick={handleReload}>
//               Reload
//             </Button>
//           </Space>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SalonOwnerAccountPage;
import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Descriptions,
  message,
  Typography,
  Button,
  Space,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AccountServices } from "../services/accountServices";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import QrScanner from "react-qr-scanner";
import "../css/SalonOwnerAccountPage.css";

function SalonOwnerAccountPage() {
  const { id } = useParams();
  const userName = useSelector((state) => state.ACCOUNT.userName);
  const idCustomer = useSelector((state) => state.ACCOUNT.idCustomer);
  const idOwner = useSelector((state) => state.ACCOUNT.idOwner);
  const uid = useSelector((state) => state.ACCOUNT.uid);

  const [salonData, setSalonData] = useState({});
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    AccountServices.GetInformationAccount(id)
      .then((res) => {
        setSalonData(res.data);
      })
      .catch((err) => {
        message.warning("Loading!!!");
      });
  }, [id]);

  const handleReload = () => {
    window?.location?.reload();
  };

  const handleScan = (data) => {
    if (data) {
      // Call your API with the scanned data
      const mappingData = {
        customerId: idCustomer,
        dataString: data.text,
      };
      AccountServices.checkInByCustomer(mappingData)
        .then((res) => {
          setShowScanner(false);
          message.success("Quét qr check in thành công");
        })
        .catch((err) => {
          setShowScanner(false);
          message.error("Quét qr check in thất bại!");
        })
        .finally((err) => {
          setShowScanner(false);
          // message.error("Failed to send QR data!");
        });
    }
  };

  const handleError = (err) => {
    console.error(err);
    message.error("Error scanning QR code!");
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div className="salon-owner-account">
      {uid ? (
        <Card className="salon-card">
          <Avatar
            src={salonData.img || <UserOutlined />}
            size={100}
            className="salon-avatar"
          />
          <Descriptions className="salon-info" column={1}>
            <Descriptions.Item>
              <Typography.Text strong>{salonData?.fullName}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item>{salonData?.phone}</Descriptions.Item>
            <Descriptions.Item>{salonData?.email}</Descriptions.Item>
          </Descriptions>
          <div className="salon-buttons">
            {idOwner && (
              <>
                <Link to="/salon_report">
                  <Button type="primary">Danh sách báo cáo của bạn</Button>
                </Link>
                <Link to="/dashboardTransaction">
                  <Button type="primary">Thống kê doanh thu</Button>
                </Link>
              </>
            )}
            {idCustomer && (
              <>
                <Link to="/customer_report">
                  <Button type="primary">Danh sách báo cáo của bạn</Button>
                </Link>
                <Button onClick={() => setShowScanner(true)} type="primary">
                  Bật quét Qr
                </Button>
              </>
            )}
          </div>
          {showScanner && (
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={previewStyle}
              facingMode="environment"
            />
          )}
        </Card>
      ) : (
        <div className="salon-reload">
          <Space direction="vertical">
            <Typography.Title>Your account is not found!</Typography.Title>
            <Button style={{ width: "100%" }} onClick={handleReload}>
              Reload
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
}

export default SalonOwnerAccountPage;
