import React from "react";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import EnterpriseCompose from "../../../components/enterprise/compose/EnterpriseCompose";

const Compose = () => {
  return (
    <DashboardLayout pageName={"Compose"}>
      {/* <PageLoader /> */}
      <EnterpriseCompose />
    </DashboardLayout>
  );
};

export default Compose;
