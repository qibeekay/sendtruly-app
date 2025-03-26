import axios from "axios";

const URL = import.meta.env.VITE_APP_BASE_URL;

const getToken = () => {
  const userData = JSON.parse(localStorage.getItem("data_user_main"));
  return userData?.token || "";
};

// Create payment links
export const CreateInvoice = async (userdata) => {
  try {
    const response = await axios.post(`${URL}/invoices/create`, userdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    //console.log("payment response", response);

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
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Network error",
    };
  }
};

// connect and verify paystack key
export const VerifyKey = async (secret) => {
  try {
    const response = await axios.post(
      `${URL}/invoices/payment/verify-secret-key`,
      secret,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    //console.log("payment response", response);

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
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Network error",
    };
  }
};

// get all invoice
export const GetPaymentLinks = async () => {
  try {
    const response = await axios.get(`${URL}/invoices/get-invoices`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    //console.log("Text2pay", response);

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Failed to fetch",
      };
    }

    return {
      success: true,
      message: response.data.message || "Links fetched successfully",
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

// send invoice / payment sms
export const SendPaymentSms = async (userdata) => {
  try {
    const response = await axios.post(
      `${URL}/invoices/text2pay/sms`,
      userdata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    //console.log("review response", response);

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

// get reviews redirect page data
export const InvoiceRedirect = async (token, number, email) => {
  try {
    const response = await axios.get(
      `${URL}/invoices/page.redirect/${token}?t=${number}e=${email}`
      // {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${getToken()}`,
      //   },
      // }
    );

    //console.log("Redirect data", response);

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Failed to fetch",
      };
    }

    return {
      success: true,
      message: response.data.message || "Links fetched successfully",
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

// activates and open payment gateway
export const ActivatePayment = async (userdata) => {
  try {
    const response = await axios.post(
      `${URL}/payment/pay-for-invoice`,
      userdata
      // {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${getToken()}`,
      //   },
      // }
    );

    //console.log("review response", response);

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

// fetch my review
export const GetMessages = async () => {
  try {
    const response = await axios.get(`${URL}/invoices/text2pay/messages`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    //console.log("humor me", response);

    // if (!response.data.success) {
    //   return {
    //     success: false,
    //     message: response.data.message || "Failed to fetch",
    //   };
    // }

    return {
      success: true,
      message: response.data.message || "Links fetched successfully",
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

// get review stats
export const PaidCustomers = async (token) => {
  try {
    const response = await axios.get(
      `${URL}/invoices/has-paid-invoices/${token}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    // console.log("Humor me payment data", response);

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Failed to fetch",
      };
    }

    return {
      success: true,
      message: response.data.message || "Links fetched successfully",
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
