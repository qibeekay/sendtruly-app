import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Alert, AlertIcon, useToast } from "@chakra-ui/react";
import { IoMdClose, IoMdChatbubbles } from "react-icons/io";
import { HiMenuAlt2 } from "react-icons/hi";
import styles from "./dashboardlayout.module.css";
import logo from "../../../assets/lg.png";
import settings from "../../../assets/settings.png";
import sms from "../../../assets/sms-outline.png";
import api from "../../../assets/api.png";
import contact from "../../../assets/contact.png";
import dash from "../../../assets/dash.png";
import enterprise from "../../../assets/enterprise.png";
import email from "../../../assets/email.png";
import logout from "../../../assets/logout.png";
import PageLoader from "../../loaders/PageLoader";
import { GetUserInfo } from "../../../api/profile";
import PaystackButton from "../../../payments/Paystack";
import { AxiosInstance } from "../../../config";

function DashboardLayout({
  pageName,
  setDash_data,
  setZero_contacts,
  payment_step,
  children,
}) {
  const [navState, setNavState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const currentPath = window.location.href;
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("data_user_main"))
  );
  const toast = useToast();
  const fixedPrice = 30000; // Fixed price for enterprise plan

  // Sync localStorage with state
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data_user_main"));
    if (data) {
      setUserData(data);
    }
  }, []);

  // console.log("users", userData);

  const toggleNav = () => {
    setNavState(!navState);
  };

  function capitalizeFirstLetter(inputString) {
    if (typeof inputString !== "string" || inputString.length === 0) {
      return "Invalid input";
    }
    return inputString.charAt(0).toUpperCase();
  }

  if (!userData.token) {
    return <Navigate to="/login" />;
  }

  // Fetch user data
  const fetchUserData = async () => {
    setIsLoading(true);
    const result = await GetUserInfo(userData?.user?.usertoken);
    setData(result?.data?.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubscription = async (payload) => {
    if (!payload.status) {
      return toast({
        title: "Payment Cancelled!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }

    setIsLoading(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/payment/verify-payment`,
        {
          usertoken: userData?.user?.usertoken,
          amount_paid: fixedPrice,
          paystack_ref: payload.paystack_ref,
          purpose: "fund_enterprise_plan",
        }
      );

      if (res.data.success) {
        toast({
          title: res.data.message || "Account funded successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        fetchUserData(); // Refresh user data after successful payment
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.dashboard_container}>
      <div
        className={
          navState
            ? `w-[250px] fixed h-screen overflow-y-scroll z-10 bg-[#042f61] p-4 ${styles.navbar_active}`
            : `w-[250px] fixed h-screen overflow-y-scroll hide-scroll z-10 bg-[#042f61] hidden lg:block p-4`
        }
      >
        <div className=" h-full flex flex-col justify-between gap-y-10">
          <div>
            <div className="flex items-center justify-between">
              <img className="w-[150px]" src={logo} alt="" />

              <IoMdClose
                className="lg:hidden cursor-pointer"
                color="white"
                size={30}
                onClick={toggleNav}
              />
            </div>

            {/* links */}
            <ul className="mt-10 font-poppins flex flex-col gap-3">
              <li>
                <Link
                  to="/dashboards"
                  className={
                    currentPath.includes("dashboards")
                      ? "flex items-center gap-5 text-[#FF5D6F] font-bold"
                      : "flex items-center gap-5 font-light text-white"
                  }
                >
                  <div className="">
                    <img src={dash} alt="" />
                  </div>{" "}
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/sms"
                  className={
                    currentPath.includes("sms")
                      ? "flex items-center gap-5 text-[#FF5D6F] font-bold"
                      : "flex items-center gap-5 font-light text-white"
                  }
                >
                  {" "}
                  <div className="">
                    <img src={sms} alt="" />
                  </div>
                  SMS
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/chats"
                  className={
                    currentPath.includes("chats")
                      ? "flex items-center gap-5 text-[#FF5D6F] font-bold"
                      : "flex items-center gap-5 font-light text-white"
                  }
                >
                  <IoMdChatbubbles color="white" className={styles.icon} />
                  Chats
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/email"
                  className={
                    currentPath.includes("chats")
                      ? "flex items-center gap-5 text-[#FF5D6F] font-bold"
                      : "flex items-center gap-5 font-light text-white"
                  }
                >
                  <div className="">
                    <img src={email} alt="" />
                  </div>
                  Email
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/enterprise/dashboard"
                  className={
                    currentPath.includes("enterprise")
                      ? "flex items-center gap-5 text-[#FF5D6F] font-bold"
                      : "flex items-center gap-5 font-light text-white"
                  }
                >
                  <div className="">
                    <img src={enterprise} alt="" />
                  </div>
                  Enterprise
                </Link>
                <div className=" pl-9 flex flex-col gap-y-3 mt-3">
                  <div className="">
                    <Link
                      to="/dashboard/enterprise/dashboard"
                      className={
                        currentPath.includes("enterprise/dashboard")
                          ? "flex items-center gap-5 text-[#FF5D6F] font-bold"
                          : "flex items-center gap-5 font-light text-white"
                      }
                    >
                      <IoMdChatbubbles className={styles.icon} />
                      Dashboard
                    </Link>
                  </div>
                  <div>
                    <Link
                      to="/dashboard/enterprise/compose"
                      className={
                        currentPath.includes("enterprise/compose")
                          ? "flex items-center gap-5 text-[#FF5D6F] font-bold"
                          : "flex items-center gap-5 font-light text-white"
                      }
                    >
                      <IoMdChatbubbles className={styles.icon} />
                      Compose
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <Link
                  to="/dashboard/contacts"
                  className={
                    currentPath.includes("contact")
                      ? "flex items-center gap-5 text-[#FF5D6F] font-bold"
                      : "flex items-center gap-5 font-light text-white"
                  }
                >
                  <div className="">
                    <img src={contact} alt="" />
                  </div>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/api-doc"
                  className={
                    currentPath.includes("api-doc")
                      ? "flex items-center gap-5 text-[#FF5D6F] font-bold"
                      : "flex items-center gap-5 font-light text-white"
                  }
                >
                  <div className="">
                    <img src={api} alt="" />
                  </div>
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* settings / profile / logout */}
          <div className="flex flex-col gap-2">
            {/* settings */}
            <div>
              <Link
                to="/dashboard/settings"
                className={
                  currentPath.includes("settings")
                    ? "flex items-center gap-5 text-[#FF5D6F] font-bold"
                    : "flex items-center gap-5 font-light text-white"
                }
              >
                <div className="">
                  <img src={settings} alt="" />
                </div>
                Settings
              </Link>
            </div>

            {/* logout */}
            <div>
              <Link
                to="/login"
                className="flex items-center gap-5 font-light text-white"
                onClick={() => localStorage.removeItem("data_user_main")}
              >
                <div className="">
                  <img src={logout} alt="" />
                </div>
                Logout
              </Link>
            </div>

            {/* profile */}
            <div className="flex items-center flex-row-reverse gap-4 justify-end">
              <div className="">
                <h4 className="text-white">
                  {userData?.user?.fname} {userData?.user?.lname}{" "}
                </h4>
              </div>
              <div className="text-white bg-black w-[3rem] aspect-square flex items-center justify-center rounded-full font-bold text-lg">
                {capitalizeFirstLetter(userData?.user?.fname)}
                {capitalizeFirstLetter(userData?.user?.lname)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-end">
        <div className="w-full lg:w-[calc(100%-250px)] bg-[#f7f5ec] min-h-screen">
          <div className={`${styles.top_nav_container} p-5`}>
            <div className={styles.top_nav_left}>
              <HiMenuAlt2 className={styles.icon} onClick={toggleNav} />
              {pageName}
            </div>
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-pinks text-lg hidden md:block">
                Subscription:{" "}
              </h1>
              <div className="text-black font-bold">
                {data?.plan_type === "Free Trial" ? (
                  "Free Plan"
                ) : data?.plan_type === "Standard-Plan" ? (
                  "Standard Plan"
                ) : data?.plan_type === "Enterprise-Plan" &&
                  data?.enterprise_info?.payment_status === "unpaid" ? (
                  <div className="flex items-center gap-2">
                    <p className="font-bold hidden md:block">Expired</p>
                    <PaystackButton
                      purpose="fund_enterprise_plan"
                      fixedAmount={fixedPrice}
                      isLoading={isLoading}
                      callback={handleSubscription}
                      customButton={
                        <button className="bg-pinks px-4 py-1 rounded-[12px] text-white cursor-pointer">
                          Subscribe
                        </button>
                      }
                    />
                  </div>
                ) : (
                  `Expires in ${data?.enterprise_info?.next_payment_date}`
                )}
              </div>
            </div>
          </div>

          <div className={`${styles.top_nav_children} px-5`}>
            <PageLoader isLoading={isLoading} />
            {!userData.kyc_status && (
              <Alert status="warning" my={"20px"}>
                <AlertIcon />
                <Link
                  to={{
                    pathname: `/kyc/${userData?.user?.usertoken}`,
                    state: { data: { state: true } },
                  }}
                >
                  {" "}
                  Click to complete kyc and enjoy full access to our services{" "}
                </Link>
              </Alert>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
