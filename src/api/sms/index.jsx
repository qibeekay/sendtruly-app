import axios from "axios";

const userData = JSON.parse(localStorage.getItem("data_user_main"));

console.log("MyData", userData);

console.log(us);

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

    if (!response.data.success) {
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

export const SendPersonalisedSms = async (userdata) => {
  try {
    const response = await axios.post(
      `${URL}/sms/send-personalized-sms`,
      userdata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
      }
    );

    if (!response.data.success) {
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

// get sms delivery report
export const GetSentMessage = async () => {
  try {
    const response = await axios.get(`${URL}/sms/get-sent-messages`, {
      headers: { Authorization: `Bearer ${bearer}` },
    });

    console.log("e kaaro", bearer);

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Failed to fetch report",
      };
    }

    return {
      success: true,
      message: response.data.message || "Report fetched  successfully",
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

// get sms delivery report
export const GetDeliveryReport = async () => {
  try {
    const response = await axios.get(`${URL}/sms/delivery-report`, {
      headers: { Authorization: `Bearer ${bearer}` },
    });

    //console.log(response);
    console.log("e kaaro", bearer);

    if (!response.data.status) {
      return {
        success: false,
        message: response.data.message || "Failed to fetch report",
      };
    }

    return {
      success: true,
      message: response.data.message || "Report fetched  successfully",
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

// get single sms delivery message
export const GetSingleReport = async (userdata) => {
  try {
    const response = await axios.get(
      `${URL}/sms/delivery-report?date_range=${userdata}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
      }
    );

    //console.log(response.data.status);
    console.log("e kaaro", bearer);

    if (!response.data.status) {
      return {
        success: false,
        message: response.data.message || "Failed to send",
      };
    }

    return {
      success: true,
      message: response.data.message || "Sms sent successfully",
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

// get single sms delivery message
export const GetScheduledSms = async () => {
  try {
    const response = await axios.get(`${URL}/sms/get-scheduled-messages`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearer}`,
      },
    });

    //console.log(response.data);
    console.log("e kaaro", bearer);

    return {
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
