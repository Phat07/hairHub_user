// src/components/RequireAuth.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children, fallbackPath }) => {
  // const isAuthenticated = useSelector((state) => state.ACCOUNT.uid);
  const isAuthenticated = sessionStorage.getItem("refreshToken");
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate(fallbackPath, { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, navigate, location, fallbackPath]);

  return isAuthenticated ? children : null;
};

export default RequireAuth;
