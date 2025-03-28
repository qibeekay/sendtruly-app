import React, { useEffect, useState } from "react";
import { ChangePlans, GetUserInfo } from "../../../api/profile";
import { HiX } from "react-icons/hi";
import { useToast } from "@chakra-ui/react";

const SwitchplanModal = ({ isOpen, onClose, onPlanChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(""); // State to track the selected plan
  const [userInfo, setUserInfo] = useState(null); // State to store user info
  const userData = JSON.parse(localStorage.getItem("data_user_main"));
  const toast = useToast();

  // Fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    const result = await GetUserInfo(userData?.user?.usertoken);
    if (result.success) {
      setUserInfo(result.data.data); // Store user info
      setSelectedPlan(result.data.data.plan_type); // Set the default selected plan
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserData(); // Fetch user data when the modal is opened
    }
  }, [isOpen]);

  // Function to handle plan selection
  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
  };

  // Function to change plan
  const changePlan = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedPlan) {
      toast({
        title: "Error",
        description: "Please select a plan.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    const result = await ChangePlans(selectedPlan); // Pass the selected plan to the API

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    setIsLoading(false);

    if (result.success) {
      onPlanChange(); // Call the callback function to refetch dashboard data
      fetchUserData();
      onClose(); // Close the modal on success
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 w-full bg-black/50 min-h-screen z-[100] items-center justify-center ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="bg-white h-[35rem] overflow-y-scroll font-poppins p-7 rounded-[10px] w-[30rem] hide-scroll">
        <div className="flex items-center flex-row-reverse justify-between">
          {/* Close button */}
          <button className="" onClick={onClose}>
            <HiX size={25} />
          </button>

          <h1 className="text-[24px] font-bold">Switch Plans</h1>
        </div>

        {/* Plan selection */}
        <div className="mt-6">
          <div className="flex flex-col gap-4">
            {/* Free Plan */}
            {/* <button
              className={`p-4 border rounded-lg text-left ${
                selectedPlan === "Free Trial"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
              onClick={() => handlePlanSelection("Free Trial")}
            >
              <h2 className="font-semibold">Free Plan</h2>
              <p className="text-sm text-gray-600">
                Ideal for individuals and small teams.
              </p>
            </button> */}

            {/* Standard Plan */}
            <button
              className={`p-4 border rounded-lg text-left ${
                selectedPlan === "Standard-Plan"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
              onClick={() => handlePlanSelection("Standard-Plan")}
            >
              <h2 className="font-semibold">Standard Plan</h2>
              <p className="text-sm text-gray-600">
                Perfect for growing businesses.
              </p>
            </button>

            {/* Enterprise Plan */}
            <button
              className={`p-4 border rounded-lg text-left ${
                selectedPlan === "Enterprise-Plan"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
              onClick={() => handlePlanSelection("Enterprise-Plan")}
            >
              <h2 className="font-semibold">Enterprise Plan</h2>
              <p className="text-sm text-gray-600">
                For large organizations with advanced needs.
              </p>
            </button>
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-6">
          <button
            onClick={changePlan}
            disabled={isLoading}
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? "Processing..." : "Change Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwitchplanModal;
