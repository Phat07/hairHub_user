// hooks/useAuth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useSignIn, useIsAuthenticated, useAuthUser } from "react-auth-kit";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import isAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { message } from "antd";
import jwt_decode from "jwt-decode";
import { AccountServices } from "../services/accountServices";
import { useSelector } from "react-redux";

const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = jwt_decode(token);
  return decodedToken.exp * 1000 < Date.now();
};

// const token = useSelector(
//     (state) => state.ACCOUNT.token
//   );
const useAuth = () => {
  const navigate = useNavigate();


  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const res = await AccountServices.refreshToken(refreshToken);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        return res.data.accessToken;
      } else {
        throw new Error("No refresh token found");
      }
    } catch (error) {
      throw new Error("Failed to refresh token");
    }
  };

  const fetchUserByToken = async (token) => {
    try {
      const res = await AccountServices.fetchUserByToken(token);
      if (res && res.data) {
        signIn({
          auth: {
            token: localStorage.getItem("accessToken"),
            type: "Bearer",
          },
          userState: {
            token: res.data.accessToken,
            username: res.data.salonOwnerResponse?.fullName || res.data.customerResponse?.fullName,
            uid: res.data.accountId,
            idOwner: res.data.salonOwnerResponse?.id,
            idCustomer: res.data.customerResponse?.id,
            refreshToken: res.data.refreshToken,
          },
        });
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (err) {
      // console.log("Error fetching user by token:", err);
      navigate("/login");
    }
  };

  const authenticateUser = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        accessToken = await refreshToken();
      }

      if (token && !isTokenExpired(accessToken)) {
        await fetchUserByToken(accessToken);
      } else {
        accessToken = await refreshToken();
        await fetchUserByToken(accessToken);
      }
    } catch (error) {
      message.error("Session expired. Please log in again.");
      navigate("/login");
    }
  };

  useEffect(() => {
    authenticateUser();
  }, [navigate]);
};

export default useAuth;
