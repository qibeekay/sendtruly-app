import styles from "./dashboardlayout.module.css";
import logo from "../../../assets/logo.png";
import { Link, Navigate } from "react-router-dom";

// icons imports
import { MdDashboard } from "react-icons/md";
import { FaMessage } from "react-icons/fa6";
import { IoMdChatbubbles } from "react-icons/io";
import { MdContactPage } from "react-icons/md";
import { RiFileHistoryFill } from "react-icons/ri";
import { SiReadthedocs } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";

import { IoMdClose } from "react-icons/io";
import { HiMenuAlt2 } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Alert, AlertIcon, useToast } from "@chakra-ui/react";
import { AxiosInstance } from "../../../config";
import PageLoader from "../../loaders/PageLoader";

function DashboardLayout({
  pageName,
  setDash_data,
  setZero_contacts,
  payment_step,
  children,
}) {
  const toast = useToast();
  const [navState, setNavState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentPath = window.location.href;
  const userData = JSON.parse(localStorage.getItem("data_user_main"));
  const dash_data = JSON.parse(localStorage.getItem("dash_data"));

  const usertoken = userData?.user?.user?.usertoken;
  const toggleNav = () => {
    setNavState(!navState);
  };

  function capitalizeFirstLetter(inputString) {
    // Check if the input is a valid string
    if (typeof inputString !== "string" || inputString.length === 0) {
      return "Invalid input";
    }

    // Extract the first letter and capitalize it
    const firstLetter = inputString.charAt(0).toUpperCase();

    return firstLetter;
  }

  if (!userData) {
    return <Navigate to="/login" />;
  }

  // get all lists list api
  const getUserData = async () => {
    if (!dash_data) {
      setIsLoading(true);
    }

    try {
      const res = await AxiosInstance.get(
        `${import.meta.env.VITE_APP_BASE_URL}/user-dashboard-info`,
        {
          usertoken,
        }
      );
      setIsLoading(false);
      if (res.data.success) {
        if (setDash_data) {
          setDash_data(res.data.data);
          if (parseInt(res.data.data.total_contacts.data.contact_count) <= 0) {
            setZero_contacts(true);
          }
        }
        localStorage.setItem("dash_data", JSON.stringify(res.data.data));
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getUserData();
  }, [payment_step, pageName]);

  return (
    <div className={styles.dashboard_container}>
      <div
        className={
          navState
            ? `${styles.dashboard_navigation} ${styles.navbar_active}`
            : `${styles.dashboard_navigation}`
        }
      >
        <div className={styles.dashboard_logo_flex}>
          <img src={logo} alt="" />
          <IoMdClose className={styles.icon} onClick={toggleNav} />
        </div>
        <ul>
          <li>
            <Link
              to="/dashboard"
              className={
                currentPath === "http://localhost:5173/dashboard" ||
                currentPath === "https://sendtrulyapp.netlify.app/dashboard"
                  ? styles.active
                  : ""
              }
            >
              <MdDashboard className={styles.icon} /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/sms"
              className={currentPath.includes("sms") ? styles.active : ""}
            >
              {" "}
              <FaMessage className={styles.icon} />
              SMS
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/chats"
              className={currentPath.includes("chats") ? styles.active : ""}
            >
              <IoMdChatbubbles className={styles.icon} />
              Chats
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/contacts"
              className={currentPath.includes("contact") ? styles.active : ""}
            >
              <MdContactPage className={styles.icon} />
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/history"
              className={currentPath.includes("history") ? styles.active : ""}
            >
              <RiFileHistoryFill className={styles.icon} />
              History
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/api-doc"
              className={currentPath.includes("api") ? styles.active : ""}
            >
              <SiReadthedocs className={styles.icon} />
              API
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/settings"
              className={currentPath.includes("settings") ? styles.active : ""}
            >
              <IoMdSettings className={styles.icon} />
              Settings
            </Link>
          </li>
          <li className={styles.logout_button}>
            <Link
              to="/login"
              onClick={() => localStorage.removeItem("data_user_main")}
            >
              <IoMdLogOut className={styles.icon} />
              Logout
            </Link>
          </li>
        </ul>
      </div>
      <div className="w-full flex items-center justify-end">
        <div className="w-full lg:w-[calc(100%-250px)] bg-[#f7f5ec] min-h-screen">
          <div className={`${styles.top_nav_container} p-5`}>
            <div className={styles.top_nav_left}>
              {" "}
              <HiMenuAlt2 className={styles.icon} onClick={toggleNav} />{" "}
              {pageName}
            </div>
            <div className={styles.top_nav_right}>
              <div className={styles.top_name_flex}>
                <h4>
                  {userData?.user?.fname} {userData?.user?.lname}
                </h4>
                <span>Member since '24</span>
              </div>
              <div className={styles.top_name_logo}>
                {capitalizeFirstLetter(userData?.user?.fname)}
                {capitalizeFirstLetter(userData?.user?.lname)}
              </div>
            </div>
          </div>
          <div className={`${styles.top_nav_children} px-5`}>
            <PageLoader isLoading={isLoading} />
            {!userData.kyc_status && (
              <Alert status="warning" mt={"20px"}>
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
