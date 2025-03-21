import axios from "axios";

const URL = import.meta.env.VITE_APP_BASE_URL;

const getToken = () => {
  const userData = JSON.parse(localStorage.getItem("data_user_main"));
  return userData?.token || "";
};

// get all list
export const GetUserInfo = async (identifier) => {
  try {
    const response = await axios.post(
      `${URL}/profile/get-user-data
        `,
      { identifier },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    //console.log("response", getToken());

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

// change plans
export const ChangePlans = async (plan_name) => {
  try {
    const response = await axios.post(
      `${URL}/profile/change-plan
        `,
      { plan_name },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    //console.log("response", getToken());

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
