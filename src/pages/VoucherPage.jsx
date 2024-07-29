import React from "react";
import Header from "../components/Header";

function VoucherPage(props) {
  return (
    <div>
      <Header />
      <div
        style={{
          marginTop: "140px",
          marginLeft: "250px",
          marginRight: "250px",
        }}
      ></div>
      <div style={{ marginLeft: "20rem", fontFamily: "Ariel", color: "black" }}>
        list voucher
      </div>
    </div>
  );
}

export default VoucherPage;
