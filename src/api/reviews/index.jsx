import axios from "axios";

const URL = import.meta.env.VITE_APP_BASE_URL;

const getToken = () => {
  const userData = JSON.parse(localStorage.getItem("data_user_main"));
  return userData?.token || "";
};

// create review links
export const CreateLink = async (userdata) => {
  try {
    const response = await axios.post(`${URL}/reviews/create-links`, userdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    //console.log("review response", response);
    //console.log(getToken);

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

// get review links
export const GetReviewLinks = async () => {
  try {
    const response = await axios.get(`${URL}/reviews/user-links`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    //console.log(response);

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

// get reviews redirect page data
export const ReviewRedirect = async (token, number) => {
  try {
    const response = await axios.get(
      `${URL}/reviews/page.redirect/${token}?t=${number}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      }
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

// get review stats
export const ReviewStats = async (token) => {
  try {
    const response = await axios.get(`${URL}/reviews/statistics/${token}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    //console.log("Humor me Stats data", response);

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

// send review sms
export const SendReviewSms = async (userdata) => {
  try {
    const response = await axios.post(`${URL}/reviews/send-sms`, userdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

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

// make a review
export const MakeReview = async (userdata) => {
  try {
    const response = await axios.post(`${URL}/reviews/user/review`, userdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

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
export const GetReviews = async () => {
  try {
    const response = await axios.get(`${URL}/reviews/my-reviews`, {
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
