import axios from "axios";

const userData = JSON.parse(localStorage.getItem("data_user_main"));

const bearer = userData?.token;
const URL = import.meta.env.VITE_APP_BASE_URL;

// get estimated cost
export const GetEstimate = async (userdata) => {
  try {
    const response = await axios.post(`${URL}/cost/estimate-cost`, userdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearer}`,
      },
    });

    if (!response.data.status) {
      return {
        success: false,
        message: response.data.message || "Failed to get estimate",
      };
    }

    return {
      success: true,
      message: response.data.message || "Estimate fetched successfully",
      data: response.data.data,
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

// send sms

export const SendSms = async (userdata) => {
  try {
    const response = await axios.post(`${URL}/sms/send-sms`, userdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearer}`,
      },
    });

    if (!response.data.status) {
      return {
        success: false,
        message: response.data.message || "Failed to send",
      };
    }

    return {
      success: true,
      message: response.data.message || "Sms sent successfully",
      data: response.data.data,
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
