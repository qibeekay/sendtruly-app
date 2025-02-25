import React, { useContext, useState } from "react";
import { AddUserToList, GetAllList } from "../../api/contact";
import Datepicker from "react-tailwindcss-datepicker";
import { HiOutlineChevronDown, HiX } from "react-icons/hi";
import dayjs from "dayjs";

import { useToast } from "@chakra-ui/react";
import { RefreshContext } from "../../utility/RefreshContext";

const AddContactModal = ({ isOpen, onClose, list_token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [contactsList, setContactsList] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const { triggerRefresh } = useContext(RefreshContext);
  const toast = useToast();

  // handle date value
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    gender: "",
    date_of_birth: "",
    anniversary: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (gender) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleDateChange = (newValue) => {
    const formattedDate = dayjs(newValue.startDate).format("DD-MM-YYYY");
    setFormData((prevFormData) => ({
      ...prevFormData,
      date_of_birth: formattedDate,
    }));
    setValue(newValue);
  };

  const validateContact = () => {
    return (
      formData.name &&
      formData.email &&
      formData.number &&
      formData.gender &&
      formData.anniversary &&
      formData.date_of_birth
    );
  };

  console.log(list_token);

  // function handles adding contacts to an array before being uploaded
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!validateContact()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setContactsList((prev) => [...prev, formData]);
    setFormData({
      name: "",
      email: "",
      number: "",
      gender: "",
      date_of_birth: "",
      anniversary: "",
    });
    setValue({ startDate: null, endDate: null });
  };

  // function to upload contacts
  const createContacts = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await AddUserToList({ list_token, contact: contactsList });

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    if (result.success) {
      onClose();
      setContactsList([]);
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
          {/* close button */}
          <button className="w-full flex justify-end mb-4" onClick={onClose}>
            <HiX size={25} />
          </button>

          <h1 className="text-[24px]">Add Contacts</h1>
          {contactsList.length > 0 && (
            <div className="my-4">
              {/* Toggle button */}
              <button
                onClick={() => setShowContacts(!showContacts)}
                className="flex items-center gap-2 text-pinks font-medium hover:text-pinks/80 transition-colors duration-200"
              >
                <span>View Added Contacts ({contactsList.length})</span>
                <HiOutlineChevronDown />
              </button>

              {/* Dropdown content */}
              {showContacts && (
                <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                  {contactsList.map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                      <HiX
                        size={18}
                        className="ml-2 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() =>
                          setContactsList((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <form action="">
            {/* name */}
            <div className="flex flex-col gap-2 my-5">
              <label htmlFor="List">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="p-3 border shadow-md outline-pinks"
              />
            </div>

            {/* email */}
            <div className="flex flex-col gap-2 my-5">
              <label htmlFor="List ">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-3 border shadow-md outline-pinks"
              />
            </div>

            {/* phone */}
            <div className="flex flex-col gap-2 my-5">
              <label htmlFor="List" className="">
                Phone Number
              </label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                className="p-3 border shadow-md outline-pinks"
              />
            </div>

            {/* gender select */}
            <div className="mb-4 flex gap-2">
              {/* male select  */}
              <label className="flex items-center gap-2 font-medium text-lg cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === "male"}
                  onChange={() => handleGenderChange("male")}
                />
                Male
              </label>

              <label className="flex items-center gap-2 font-medium text-lg cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === "female"}
                  onChange={() => handleGenderChange("female")}
                />
                Female
              </label>
            </div>

            {/* date picker */}
            <div className="w-full">
              <Datepicker
                useRange={false}
                asSingle={true}
                value={value}
                popoverDirection="up"
                displayFormat="DD-MM-YYYY"
                onChange={handleDateChange}
                showShortcuts={false}
                placeholder="Date of Birth"
                // classNames={'w-full'}
                inputClassName="w-full  rounded-md focus:ring-0 border border-[#C2C8D0]/60 font-normal border p-4 bg-bgGreen placeholder:text-[#858585]"
              />
            </div>

            {/* phone */}
            <div className="flex flex-col gap-2 my-5">
              <label htmlFor="List">Anniversary</label>
              <input
                type="text"
                name="anniversary"
                value={formData.anniversary}
                onChange={handleInputChange}
                className="p-3 border shadow-md outline-pinks"
              />
            </div>

            {/* button */}
            <div className="flex flex-col gap-4 mt-10">
              <button
                type="button"
                onClick={handleAddContact}
                className="border border-pinks rounded-[10px] text-pinks px-6 py-4 bg-white hover:bg-pinks/10 duration-300 ease-in-out"
              >
                {contactsList.length === 0
                  ? "Add Contacts"
                  : "Add More Contacts"}
              </button>

              <button
                onClick={createContacts}
                disabled={contactsList.length === 0 || isLoading}
                className={`border border-pinks rounded-[10px] text-white px-6 py-4 bg-pinks hover:bg-pinks/80 duration-300 ease-in-out ${
                  contactsList.length === 0 ? "hidden" : "block"
                }`}
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

export default AddContactModal;
