import axios from "axios";

const getToken = () => {
  const userData = JSON.parse(localStorage.getItem("data_user_main"));
  return userData?.token || "";
};

const URL = import.meta.env.VITE_APP_BASE_URL;

// create list
export const CreateList = async (userdata) => {
  try {
    const response = await axios.post(`${URL}/contact/create-list`, userdata, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!response.data.status) {
      return {
        success: false,
        message: response.data.message || "Failed to create list",
      };
    }

    return {
      success: true,
      message: response.data.message || "List created successfully",
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

// get all list
export const GetAllList = async () => {
  try {
    const response = await axios.get(`${URL}/contact/get-all-lists`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    //console.log(response.data.data);

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Failed to create list",
      };
    }

    return {
      success: true,
      message: response.data.message || "List created successfully",
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

// add contact to list
export const AddUserToList = async (userdata) => {
  try {
    const response = await axios.post(
      `${URL}/contact/add-contact-to-list`,
      userdata,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (!response.data.status) {
      return {
        success: false,
        message: response.data.message || "Failed to create contacts",
      };
    }

    return {
      success: true,
      message: response.data.message || "Contacts created successfully",
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

// get all contacts
export const GetAllContacts = async () => {
  try {
    const response = await axios.get(`${URL}/contact/get-all-contacts`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    //console.log(response.data.data);

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Failed to fetch Contacts",
      };
    }

    return {
      success: true,
      message: response.data.message || "Contacts fetched successfully",
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

// get contacts by token
export const GetContactsByToken = async (userdata) => {
  try {
    const response = await axios.post(
      `${URL}/contact/get-list-by-token`,
      userdata,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Failed to create contacts",
      };
    }

    return {
      success: true,
      message: response.data.message || "Contacts created successfully",
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

// upload bulkcontact to list
export const UploadBulkContact = async (userdata) => {
  try {
    const response = await axios.post(
      `${URL}/contact/bulk-upload-contacts`,
      userdata,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (!response.data.status) {
      return {
        success: false,
        message: response.data.message || "Failed to create contacts",
      };
    }

    return {
      success: true,
      message: response.data.message || "Contacts created successfully",
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

export const DeleteGroup = async (userdata) => {
  try {
    const response = await axios.post(
      `${URL}/contact/delete-user-list`,
      userdata,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    //console.log(response);

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Failed to delete group",
      };
    }

    return {
      success: true,
      message: response.data.message || "Group delete successfully",
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
