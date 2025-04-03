import React, { useEffect, useState } from "react";
import { GetAllList, GetContactsByToken } from "../../api/contact";
import { Select, useToast } from "@chakra-ui/react";
import { GetDeliveryReport, GetEstimate } from "../../api/sms";
import EstimatedPriceModal from "./EstimatedPriceModal";

const PersonalisedMessage = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [selectedListTokens, setSelectedListTokens] = useState([]);
  const [groupContactsCache, setGroupContactsCache] = useState({});
  const [estimate, setEstimate] = useState({});
  const [manualInput, setManualInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("data_user_main"));

  const toast = useToast();

  const [bulkSmsData, setBulkSmsData] = useState({
    sender_id: "",
    // usertoken: userData?.token || "",
    message: "",
    contacts: [],
    contact_numbers: [],
    message_type: "",
    is_drafted: false,
    delivery_route: "",
    scheduled: false,
    scheduled_data: { schedule_type: "Daily", scheduled_number: "1" },
    sms_cost: 0,
  });

  // Function to open modal with group data
  const openModal = () => {
    if (
      !bulkSmsData.sender_id.trim() ||
      !bulkSmsData.message.trim() ||
      !bulkSmsData.message_type ||
      !bulkSmsData.delivery_route ||
      (bulkSmsData.contacts.length === 0 &&
        bulkSmsData.contact_numbers.length === 0)
    ) {
      toast({
        title: "Please fill in all required fields before proceeding.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setIsModalOpen(true); // Open the modal
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Fetch groups on mount
  useEffect(() => {
    const getAllList = async () => {
      setIsLoading(true);
      const result = await GetAllList();
      setGroups(result.data);
      setIsLoading(false);
    };
    getAllList();
  }, []);

  // Handle group selection
  const handleListSelection = (list_token) => {
    setSelectedListTokens((prev) =>
      prev.includes(String(list_token))
        ? prev.filter((t) => t !== String(list_token))
        : [...prev, String(list_token)]
    );
  };

  // handle sms input change
  const smsInputChange = (event) => {
    const { name, value } = event.target;
    // Update the specific field in the formData state
    setBulkSmsData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // handle delivery route change
  const handleRouteChange = (delivery_route) => {
    setBulkSmsData((prev) => ({ ...prev, delivery_route }));
  };

  // Fetch contacts for newly selected groups
  useEffect(() => {
    const fetchMissingContacts = async () => {
      const tokensToFetch = selectedListTokens.filter(
        (token) => !groupContactsCache[token]
      );

      if (tokensToFetch.length === 0) return;

      const newCache = { ...groupContactsCache };

      for (const token of tokensToFetch) {
        const result = await GetContactsByToken({ list_token: token });
        newCache[token] = result?.data?.contacts.map((c) => c.number) || [];
      }

      setGroupContactsCache(newCache);
    };

    fetchMissingContacts();
  }, [selectedListTokens]);

  // fetch estimated cost
  const fetchEstimate = async () => {
    setLoading(true);
    const result = await GetEstimate({
      usertoken: userData?.token,
      list_token: selectedListTokens,
      message: bulkSmsData?.message,
      delivery_route: bulkSmsData?.delivery_route,
      contact_numbers: bulkSmsData?.contact_numbers,
    });
    setEstimate(result.data);
    setLoading(false);
  };

  // function to schedule input changes
  const scheduleInputChange = (event) => {
    const { name, value } = event.target;
    const oldData = bulkSmsData.scheduled_data;
    // Update the specific field in the formData state
    setBulkSmsData((prevFormData) => ({
      ...prevFormData,
      scheduled_data: {
        ...oldData,
        [name]: value,
      },
    }));
  };

  // Update group contacts when cache or selection changes
  useEffect(() => {
    const groupContacts = selectedListTokens.flatMap(
      (token) => groupContactsCache[token] || []
    );

    setBulkSmsData((prev) => ({
      ...prev,
      contacts: selectedListTokens,
      // contacts: groupContacts,
    }));
  }, [selectedListTokens, groupContactsCache]);

  // Handle manual input changes
  const handleManualInputChange = (e) => {
    const input = e.target.value;
    setManualInput(input);

    // Parse numbers and update contact_numbers
    const numbers = input
      .split(/[\s,;]+/)
      .map((num) => num.trim())
      .filter((num) => num !== "");

    setBulkSmsData((prev) => ({
      ...prev,
      contact_numbers: numbers,
    }));
  };

  // Format the message and link/invoice for display
  const formattedMessage = (
    <div>
      <p>Hi Receiver's name,</p>
      <p className="py-2">{bulkSmsData.message}</p>
    </div>
  );
  return (
    <div>
      <div className="">
        {/* form */}
        <form action="" className="w-full flex flex-col gap-4">
          {/* sender-id / contacts list */}
          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full flex flex-col gap-4">
              {/* sender-id */}
              <div>
                <label htmlFor="sender_id">Sender ID</label>
                <div>
                  <input
                    className="w-full p-4 border border-black/25 rounded-lg"
                    type="text"
                    name="sender_id"
                    value={bulkSmsData.sender_id}
                    onChange={smsInputChange}
                    placeholder="e.g: Chicken Republic"
                  />
                </div>
              </div>

              {/* phone Numbers */}
              <div>
                <label htmlFor="phone-number">Phone numbers</label>
                <textarea
                  value={manualInput}
                  onChange={handleManualInputChange}
                  placeholder="Enter numbers separated by comma, space or semicolon"
                  className="resize-none border border-black/25 p-4 w-full h-[272px] rounded-[10px]"
                />
                <div className="mt-2 flex items-center justify-between">
                  <p>From Groups: {bulkSmsData.contacts.length}</p>
                  <p>Manual Entries: {bulkSmsData.contact_numbers.length}</p>
                </div>
              </div>
            </div>

            {/* contacts list */}
            <div className="w-full md:w-[30rem]">
              <div className=" bg-white p-4 rounded-[10px]">
                <h1>Add from list and group</h1>

                <div className="flex flex-col gap-2 mt-5">
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    groups?.map((group) => (
                      <div
                        key={group.list_token}
                        className="flex items-center justify-between"
                      >
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedListTokens.includes(
                              String(group.list_token)
                            )}
                            onChange={() =>
                              handleListSelection(group.list_token)
                            }
                            className="w-5 rounded aspect-square"
                          />
                          {group.list_name}
                          <span className="text-blue-500">
                            ({group.total_numbers})
                          </span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* messages / empty fields */}
          <div className="flex flex-col md:flex-row gap-10">
            {/* messages */}
            <div className="w-full">
              <label htmlFor="message">Message</label>
              <div>
                <div className="border border-black/25 rounded-t-[10px] p-4 w-full h-[57px] bg-pinks"></div>
                <textarea
                  name="message"
                  value={bulkSmsData.message}
                  onChange={(e) => {
                    const message = e.target.value;
                    // const pageCount = Math.ceil(message.length / 160); // Calculate page count
                    setBulkSmsData((prevData) => ({
                      ...prevData,
                      message,
                      // pageCount,
                    }));
                  }}
                  placeholder="Enter message here..."
                  required
                  className="resize-none w-full h-[272px] p-4 rounded-b-[10px]"
                ></textarea>

                {/* Display character and page count */}
                <div className="mt-2 text-sm flex w-full justify-end">
                  <p>
                    Page: {Math.ceil(bulkSmsData.message.length / 160)},
                    Characters left: {160 - (bulkSmsData.message.length % 160)},
                    Total Typed Characters: {bulkSmsData.message.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Display Message */}
            <div className="w-full md:w-[30rem]">
              <div className="bg-white p-4 rounded-[10px] h-full">
                <div className="bg-[#D9D9D9] text-black p-4 rounded-[10px]">
                  {formattedMessage}
                </div>
              </div>
            </div>
          </div>

          {/* message type */}
          <div>
            <label htmlFor="">Message Type</label>
            <Select
              placeholder="Select message type"
              name="message_type"
              value={bulkSmsData.message_type}
              onChange={smsInputChange}
              _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
              required
            >
              {/* <option value="0">Flash Text</option> */}
              <option value="1">Flash Plain Text</option>
              <option value="2">Unicode SMS</option>
              <option value="6">Unicode Flash SMS</option>
            </Select>
          </div>

          {/* delivery gateway */}
          <div>
            <p> Choose a Delivery Route/Gateway (Required)</p>
            <div className="border-[3px] border-[#8292ff] p-2 bg-[#8292ff6b] text-xs max-w-[580px]">
              <label htmlFor="" className="flex gap-2">
                <input
                  type="radio"
                  name="delivery_route"
                  checked={bulkSmsData?.delivery_route === "2"}
                  onChange={() => handleRouteChange("2")}
                  className=" w-5 rounded aspect-square"
                />
                <div className="flex flex-col gap-2">
                  <p className="font-medium">
                    Direct-Refund Route: Get A Refund for MTN DND Numbers
                  </p>
                  <p>
                    {" "}
                    Delivers to ONLY non-DND numbers & Get a ₦3/page refund for
                    MTN DND numbers.
                  </p>
                </div>
              </label>
            </div>

            <div className="border-[3px] border-[#d9d9d9] p-2 bg-[#d9d9d9] text-xs mt-4 max-w-[580px]">
              <label htmlFor="" className="flex gap-2">
                <input
                  type="radio"
                  name="delivery_route"
                  checked={bulkSmsData?.delivery_route === "3"}
                  onChange={() => handleRouteChange("3")}
                  className=" w-5 rounded aspect-square"
                />
                <div className="flex flex-col gap-2">
                  <p className="font-medium">
                    Direct-Corporate Route: Auto-resend to MTN DND Number via
                    the Corporate Route
                  </p>
                  <p>
                    {" "}
                    Delivers to non-DND and MTN DND Numbers. MTN numbers will
                    cost ₦4.99/pg
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* schedule message */}
          <div>
            <button
              type="button"
              className=" text-white bg-pinks text-[24px] font-bold rounded-[10px] py-2 px-6 mt-1"
              onClick={() =>
                setBulkSmsData((prevData) => ({
                  ...prevData,
                  scheduled: !prevData.scheduled, // Toggle the state
                }))
              }
            >
              Schedule
            </button>
          </div>
          {bulkSmsData.scheduled && (
            <>
              <div>
                <label mt={10} as="h5" size="sm" fontFamily={"inherit"}>
                  Select Date and Time
                </label>
                <input
                  placeholder="Select Date and Time"
                  size="md"
                  name="date_time"
                  onChange={scheduleInputChange}
                  type="datetime-local"
                  required
                />
              </div>
              <div>
                <label mt={5} as="h5" size="sm" fontFamily={"inherit"}>
                  Schedule type
                </label>
                <select
                  placeholder="Select"
                  name="schedule_type"
                  onChange={scheduleInputChange}
                  required
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div>
                <label>Number of time schedule should occur</label>
                <select
                  placeholder="Select"
                  name="schedule_number"
                  onChange={scheduleInputChange}
                  required
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
            </>
          )}

          {/* buttons */}
          <div>
            <button
              type="button"
              className="border border-black/25 rounded-[10px] p-4 cursor-pointer bg-pinks text-white text-lg w-full md:w-[653px]"
              onClick={openModal}
            >
              Proceed to analysis
            </button>
          </div>
        </form>

        <EstimatedPriceModal
          isOpen={isModalOpen}
          onClose={closeModal}
          estimate={estimate}
          loading={Loading}
          smsData={bulkSmsData}
          fetchEstimate={fetchEstimate}
          isPersonalised={true}
        />
      </div>
    </div>
  );
};

export default PersonalisedMessage;
