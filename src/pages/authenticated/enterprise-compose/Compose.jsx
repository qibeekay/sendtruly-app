import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import EnterpriseCompose from "../../../components/enterprise/compose/EnterpriseCompose";
import { GetUserInfo } from "../../../api/profile";
import PageLoader from "../../../components/loaders/PageLoader";

const Compose = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("data_user_main"))
  );

  // Sync localStorage with state
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data_user_main"));
    if (data) {
      setUserData(data);
    }
  }, []);

  // Check if user should see the plan modal
  const shouldShowPlanModal = (userData) => {
    if (!userData) return false;

    const isNotEnterprise = userData.plan_type !== "Enterprise-Plan";
    const isUnpaidEnterprise =
      userData.plan_type === "Enterprise-Plan" &&
      userData.enterprise_info?.payment_status === "unpaid";

    return isNotEnterprise || isUnpaidEnterprise;
  };

  // Fetch user data
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const result = await GetUserInfo(userData?.user?.usertoken);
      setData(result?.data?.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <DashboardLayout pageName={"Compose"}>
      <PageLoader isLoading={isLoading} />

      {/* Inline Modal Implementation */}
      {showPlanModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Upgrade Required
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You need to switch to the Enterprise Plan and complete
                      your subscription payment to access this page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/dashboards";
                }}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {!showPlanModal && ( */}
      <EnterpriseCompose
        userData={userData}
        shouldShowPlanModal={shouldShowPlanModal}
        setShowPlanModal={setShowPlanModal}
      />
      {/* )} */}
    </DashboardLayout>
  );
};

export default Compose;
