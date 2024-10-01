import React, { useEffect } from "react";
import styles from "../css/imagesForSalon.module.css";
import { SmoothScrollHero } from "@/components/SmoothScrollHero";
import { HoverImageLinks } from "@/components/HoverImageLinks";
import { useDispatch, useSelector } from "react-redux";
import { actGetSalonInformationByOwnerId } from "@/store/salonInformation/action";

function ImageForSalon(props) {
  const ownerId = useSelector((state) => state.ACCOUNT.idOwner);

  const dispatch = useDispatch();
  useEffect(() => {
    if (ownerId) {
      dispatch(actGetSalonInformationByOwnerId(ownerId));
    }
  }, [ownerId]);
  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  console.log("salon", salonDetail);

  return (
    <div className={styles["dashboard-container"]}>
      Xin chào {salonDetail?.name}
      <div className="flex items-center justify-around">
        <div className="w-3/12">chỗ thêm hình ảnh baber của bạn</div>
        <div className="w-9/12">
          chỗ hiện hình ảnh baber của bạn
          {/* <SmoothScrollHero /> */}
        </div>
      </div>
      {/* <SmoothScrollHero/> */}
      {/* <HoverImageLinks/> */}
    </div>
  );
}

export default ImageForSalon;
