// import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { useEffect } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useDispatch, useSelector } from "react-redux";
import { actGetAllSalonInformation, actGetSalonInformationByOwnerId } from "./store/salonInformation/action";
import { actGetAllServicesBySalonId } from "./store/salonEmployees/action";
import { actGetAllPaymentList } from "./store/config/action";
import HeaderUnAuth from "./components/HeaderUnAuth";

function App() {
  const auth = useAuthUser();
  const dispatch = useDispatch();

  const ownerId = auth?.idOwner;

  const salonDetail = useSelector(
    (state) => state.SALONINFORMATION.getSalonByOwnerId
  );
  useEffect(() => {
    dispatch(actGetSalonInformationByOwnerId(ownerId));
    dispatch(actGetAllPaymentList(ownerId, 1, 10));
    dispatch(actGetAllSalonInformation);
  }, []);

  useEffect(() => {
    dispatch(actGetAllServicesBySalonId(salonDetail?.id));
  }, [salonDetail]);
  return (
    <>
      {auth ? <Header /> : <HeaderUnAuth />}
    </>
  );
}

export default App;
