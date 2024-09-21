// // src/components/RequireAuth.jsx
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';

// const RequireAuth = ({ children, fallbackPath }) => {
//   // const isAuthenticated = useSelector((state) => state.ACCOUNT.uid);
//   const isAuthenticated = localStorage.getItem("refreshToken");
//   const navigate = useNavigate();
//   const location = useLocation();

//   React.useEffect(() => {
//     if (!isAuthenticated) {
//       navigate(fallbackPath, { state: { from: location }, replace: true });
//     }
//   }, [isAuthenticated, navigate, location, fallbackPath]);

//   return isAuthenticated ? children : null;
// };

// export default RequireAuth;

// import React, { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const RequireAuth = ({ children, fallbackPath, requiredRole }) => {
//   const isAuthenticated = localStorage.getItem("refreshToken");
//   const role = localStorage.getItem("role");

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       // Nếu người dùng không đăng nhập, điều hướng đến trang đăng nhập
//       navigate(fallbackPath, { state: { from: location }, replace: true });
//       return;
//     }

//     // Kiểm tra nếu role không khớp với requiredRole thì điều hướng đến trang unauthorized
//     if (role !== requiredRole) {
//       navigate("/404", { replace: true });
//       return;
//     }
//   }, [isAuthenticated, navigate, location, fallbackPath, requiredRole, role]);

//   return isAuthenticated && role === requiredRole ? children : null;
// };

// export default RequireAuth;

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children, fallbackPath, requiredRoles = [] }) => {
  const isAuthenticated = localStorage.getItem("refreshToken");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Nếu người dùng không đăng nhập, điều hướng đến trang đăng nhập
      navigate(fallbackPath, { state: { from: location }, replace: true });
      return;
    }

    // Kiểm tra nếu requiredRoles không phải là mảng hoặc role không nằm trong danh sách requiredRoles
    if (!Array.isArray(requiredRoles) || !requiredRoles.includes(role)) {
      navigate("/404", { replace: true });
      return;
    }
  }, [isAuthenticated, navigate, location, fallbackPath, requiredRoles, role]);

  return isAuthenticated && requiredRoles.includes(role) ? children : null;
};

export default RequireAuth;


