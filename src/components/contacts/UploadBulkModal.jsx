import React, { useContext, useState } from "react";
import { HiX } from "react-icons/hi";
import { UploadBulkContact } from "../../api/contact";
import { RefreshContext } from "../../utility/RefreshContext";
import { useToast } from "@chakra-ui/react";

const UploadBulkModal = ({ isOpen, onClose, groups }) => {
  const { triggerRefresh } = useContext(RefreshContext);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState(""); // State to store the file name
  const [selectedFile, setSelectedFile] = useState(null); // State to store the file object

  const toast = useToast();

  const [formData, setFormData] = useState({
    list_token: "",
    contacts: null, // This will now store the file
  });

  // Path to the CSV file in the public folder
  const csvFilePath = "/random_contacts.csv";

  // Function to trigger the download
  const downloadCsv = () => {
    const link = document.createElement("a");
    link.href = csvFilePath;
    link.download = "example_contacts.csv"; // Name of the downloaded file
    document.body.appendChild(link);
    link.click(); // Simulate a click to trigger the download
    document.body.removeChild(link); // Clean up
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Ensure the uploaded file is a CSV
    if (file.type !== "text/csv") {
      alert("Please upload a valid CSV file.");
      return;
    }

    // Set the file name and file object
    setFileName(file.name);
    setSelectedFile(file);

    // Update formData with the file
    setFormData((prev) => ({
      ...prev,
      contacts: file,
    }));
  };

  const handleSelectChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      list_token: event.target.value,
    }));
  };

  // Function to upload contacts
  const createContacts = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate if a file and group are selected
    if (!formData.contacts) {
      toast({
        title: "Error",
        description: "Please upload a CSV file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    if (!formData.list_token) {
      toast({
        title: "Error",
        description: "Please select a group.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    // Create FormData to send the file
    const payload = new FormData();
    payload.append("list_token", formData.list_token);
    payload.append("contacts", formData.contacts);

    // Call the API
    const result = await UploadBulkContact(payload);

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    if (result.success) {
      onClose();
      // Trigger refresh
      triggerRefresh();
    }

    setIsLoading(false);
  };

  return (
    <div
      className={`fixed left-0 top-0 w-full bg-black/50 min-h-screen z-[100] items-center justify-center ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="bg-white font-poppins p-7 rounded-[10px] w-[30rem]">
        <div>
          {/* Close button */}
          <button className="w-full flex justify-end mb-4" onClick={onClose}>
            <HiX size={25} />
          </button>

          <h1 className="text-[24px]">Add Contacts</h1>

          <form>
            {/* Download sample CSV */}
            <div className="flex flex-col gap-2 my-5">
              <button
                type="button"
                onClick={downloadCsv}
                className="p-3 border shadow-md outline-pinks"
              >
                Download sample CSV file
              </button>
            </div>

            {/* File upload */}
            <div className="flex items-center justify-center w-full mt-10">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> (csv
                    format only)
                  </p>
                  {fileName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Selected file: <strong>{fileName}</strong>
                    </p>
                  )}
                </div>
                <input
                  accept=".csv"
                  onChange={handleFileUpload}
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                />
              </label>
            </div>

            {/* Select list */}
            <div>
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select an option
              </label>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
                value={formData.list_token}
                onChange={handleSelectChange}
              >
                <option value="">Choose a group</option>
                {groups?.map((group, index) => (
                  <option key={index} value={group?.list_token}>
                    {group?.list_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload button */}
            <div className="flex flex-col gap-4 mt-10">
              <button
                onClick={createContacts}
                type="submit"
                className="border border-pinks rounded-[10px] text-white px-6 py-4 bg-pinks hover:bg-pinks/80 duration-300 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Upload Contacts"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadBulkModal;
