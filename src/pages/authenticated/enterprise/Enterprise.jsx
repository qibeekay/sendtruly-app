import React, { useState } from "react";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import PageLoader from "../../../components/loaders/PageLoader";
import Marketing from "../../../components/enterprise/dashboard/Marketing";
import Addlinks from "../../../components/enterprise/dashboard/Addlinks";
import ReviewHistory from "../../../components/enterprise/dashboard/ReviewHistory";

const Enterprise = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DashboardLayout pageName={"Dashboard"}>
      {/* <PageLoader /> */}
      <Marketing />
      <Addlinks />
      <ReviewHistory />
    </DashboardLayout>
  );
};

export default Enterprise;
