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
import { GetDashboardInfo } from "../../../api/dashboard";
import { GetUserInfo } from "../../../api/profile";

function DashboardLayout({
  pageName,
  setDash_data,
  setZero_contacts,
  payment_step,
  children,
}) {
  const [navState, setNavState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentPath = window.location.href;
  const userData = JSON.parse(localStorage.getItem("data_user_main"));

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

  if (!userData.token) {
    return <Navigate to="/login" />;
  }

  // Fetch user data
  const fetchUserData = async () => {
    setIsLoading(true);
    const result = await GetUserInfo(userData?.user?.usertoken);
    // setConnected(result?.data?.data?.connected);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // [payment_step, pageName];
  return (
    <div className={styles.dashboard_container}>
      <div
        className={
          navState
            ? `w-[250px] fixed h-screen z-10 bg-[#042f61] p-4 ${styles.navbar_active}`
            : `w-[250px] fixed h-screen z-10 bg-[#042f61] hidden lg:block p-4`
        }
      >
        <div className=" h-full flex flex-col justify-between">
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
            <ul className="mt-10 font-poppins flex flex-col gap-6">
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
                <div className=" pl-9 flex flex-col gap-y-4 mt-4">
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
          <div className="flex flex-col gap-5">
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
              {" "}
              <HiMenuAlt2 className={styles.icon} onClick={toggleNav} />{" "}
              {pageName}
            </div>
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-pinks text-lg">Subscription:</h1>
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
