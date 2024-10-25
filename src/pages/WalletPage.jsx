import RetroGrid from "@/components/ui/retro-grid";
import { Input } from "antd";
import React from "react";

function WalletPage(props) {
  return (
    <div className="relative flex h-[700px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#e8ee46] via-[#7a7603] to-[#93a10e] bg-clip-text text-center text-5xl font-bold leading-none tracking-tighter text-transparent">
        Nơi nhận nạp tiền
      </span>
      <br />
      <span>Quét mã Qr để nạp tiền ngay</span>
      <div className="flex items-center justify-center h-1/2 w-1/2 bg-gray-400 rounded-lg border bg-background md:shadow-xl">
        <div>Số tiền cần nạp vào ví</div>
        <Input placeholder="0" type="number"/>
      </div>
      <RetroGrid />
    </div>
  );
}

export default WalletPage;
