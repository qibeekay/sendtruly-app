import React from "react";
import AuthLayout from "../../../components/layouts/auth/AuthLayout";
import { useParams } from "react-router-dom";

function Verify() {
  const { email } = useParams();
  return <AuthLayout form="verify" email={email} />;
}

export default Verify;
