import axios from "axios";

const getToken = () => {
  const userData = JSON.parse(localStorage.getItem("data_user_main"));
  return userData?.token || "";
};

const URL = import.meta.env.VITE_APP_BASE_URL;

// get all list
export const GetDashboardInfo = async () => {
  try {
    const response = await axios.get(`${URL}/user-dashboard-info`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    //console.log(response);

    // if (!response.data.success) {
    //   return {
    //     success: false,
    //     message: response.data.message || "Failed to fetch",
    //   };
    // }

    return {
      success: true,
      message: response.data.message || "Fetched successfully",
      data: response.data,
    };
  } catch (error) {
    // Handle network/HTTP errors
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Network error",
    };
  }
};
