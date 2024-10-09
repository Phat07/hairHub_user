import createRefresh from "react-auth-kit/createRefresh";
import { API } from "../../services/api";
import { AccountServices } from "../../services/accountServices";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import jwt_decode from "jwt-decode";

const refresh = createRefresh({
  interval: 50, // Default interval; it will be adjusted based on token expiration time
  refreshApiCallback: async (param) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!accessToken || !refreshToken) {
        throw new Error("No tokens available in session storage.");
      }

      // Decode the access token to check its expiration time
      const decodedToken = jwt_decode(accessToken);
      const currentTime = Date.now() / 1000;
      const tokenExpiryTime = decodedToken.exp;
      const remainingTime = tokenExpiryTime - currentTime;

      if (remainingTime < 60) { // If the token will expire in less than 60 seconds, refresh it
        const response = await API.post(
          "/auth/RefreshToken",
          { refreshToken: refreshToken },
          {
            headers: { Authorization: `Bearer ${param.authToken}` },
          }
        );
        console.log('Sau khi gọi API để refresh token', response);

        if (response.data) {
          // Store the new tokens in session storage
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          // Fetch user by token after refreshing the token
          const userResponse = await AccountServices.fetchUserByToken(response.data.accessToken);
          if (userResponse && userResponse.data) {
            const signIn = useSignIn();
            signIn({
              auth: {
                token: response.data.accessToken,
                type: "Bearer",
                refreshToken: response.data.refreshToken,
              },
              refresh:response.data.accessToken,
              userState: {
                token: userResponse.data.accessToken,
                username: userResponse.data.salonOwnerResponse?.fullName || userResponse.data.customerResponse?.fullName,
                uid: userResponse.data.accountId,
                idOwner: userResponse.data.salonOwnerResponse?.id,
                idCustomer: userResponse.data.customerResponse?.id,
                refreshToken: userResponse.data.refreshToken,
              },
              refreshTokenExpireIn: 86400,
              refresh: {
                token: response.data.refreshToken,
                expiresIn: 86400, // Assuming the refresh token expires in 24 hours
              },
            });
          }

          return {
            isSuccess: true,
            newAuthToken: response.data.accessToken,
            newAuthTokenExpireIn: 10,
            newRefreshTokenExpiresIn: 60,
          };
        } else {
          return {
            isSuccess: false,
          };
        }
      } else {
        // Token is still valid, fetch user data with current access token
        const userResponse = await AccountServices.fetchUserByToken(accessToken);
        if (userResponse && userResponse.data) {
          const signIn = useSignIn();
          signIn({
            auth: {
              token: accessToken,
              type: "Bearer",
              refreshToken: refreshToken,
            },
            userState: {
              token: userResponse.data.accessToken,
              username: userResponse.data.salonOwnerResponse?.fullName || userResponse.data.customerResponse?.fullName,
              uid: userResponse.data.accountId,
              idOwner: userResponse.data.salonOwnerResponse?.id,
              idCustomer: userResponse.data.customerResponse?.id,
              refreshToken: refreshToken,
            },
            refreshTokenExpireIn: 86400,
            refresh: {
              token: refreshToken,
              expiresIn: 86400, // Assuming the refresh token expires in 24 hours
            },
          });
        }

        return {
          isSuccess: true,
          newAuthToken: accessToken,
          newAuthTokenExpireIn: 10,
          newRefreshTokenExpiresIn: 60,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        isSuccess: false,
      };
    }
  },
});

export default refresh;
