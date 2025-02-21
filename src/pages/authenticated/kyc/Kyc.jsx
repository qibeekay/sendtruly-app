import React from "react";
import { Navigate } from "react-router-dom";
import AuthLayout from "../../../components/layouts/auth/AuthLayout";

function Kyc() {
  // const userData = true;
  const userData = JSON.parse(localStorage.getItem("data_user_main"));

  if (!userData) {
    return <Navigate to="/login" />;
  }

  return <AuthLayout form="kyc" />;
}

export default Kyc;
