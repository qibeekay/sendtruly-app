import React, { useEffect, useState } from "react";
import EstimatedPriceModal from "../../sms/EstimatedPriceModal";
import { useToast } from "@chakra-ui/react";
import { GetAllList, GetContactsByToken } from "../../../api/contact";
import { GetEstimate } from "../../../api/sms";
import { useTabContext } from "../../../utility/TabContext";
import { GetReviewLinks, SendReviewSms } from "../../../api/reviews";

const EnterpriseCompose = () => {
  const [groups, setGroups] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [selectedListTokens, setSelectedListTokens] = useState("");
  const [estimate, setEstimate] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("data_user_main"));

  // Handles tabs
  const { activeTab, setTab } = useTabContext();

  const handleTabClick = (tab) => {
    setTab(tab);
  };

  const toast = useToast();

  const [reviewSmsData, setreviewSmsData] = useState({
    sender_id: "",
    message: "",
    list_id: "",
    link_id: "",
    delivery_route: "4",
    message_type: "0",
    sms_cost: 0,
    link_type: "external",
  });

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
    setSelectedListTokens(String(list_token));
  };

  // Update reviewSmsData when selectedListTokens changes
  useEffect(() => {
    setreviewSmsData((prevData) => ({
      ...prevData,
      list_id: selectedListTokens,
    }));
  }, [selectedListTokens]);

  // Handle SMS input change
  const smsInputChange = (event) => {
    const { name, value } = event.target;
    setreviewSmsData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //   handle selectchange
  const handleSelectChange = (event) => {
    setreviewSmsData((prev) => ({
      ...prev,
      link_id: event.target.value,
    }));
  };

  // Fetch all review links
  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoading(true);
      const result = await GetReviewLinks();
      setLinks(result.data.data);
      setIsFetching(false);
    };
    fetchLinks();
  }, []);

  //   function to send review sms
  const sendReviewSms = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await SendReviewSms(reviewSmsData);

    console.log("reviews results", result);
    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });
    setLoading(false);
  };

  return (
    <div>
      <div className="">
        {/* Form */}
        <form action="" className="w-full flex flex-col gap-4">
          {/* Sender ID / Contacts List */}
          <div className="flex gap-10">
            <div className="w-full flex flex-col gap-4">
              {/* Sender ID */}
              <div>
                <label htmlFor="sender_id">Sender ID</label>
                <div>
                  <input
                    className="w-full p-4 border border-black/25 rounded-lg"
                    type="text"
                    name="sender_id"
                    value={reviewSmsData.sender_id}
                    onChange={smsInputChange}
                    placeholder="e.g: Chicken Republic"
                  />
                </div>
              </div>
            </div>

            {/* Contacts List */}
            <div className="w-[30rem]">
              <div className="bg-white p-4 rounded-[10px]">
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
                            type="radio"
                            name="list-selection"
                            checked={
                              selectedListTokens === String(group.list_token)
                            }
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

          {/* Messages / Empty Fields */}
          <div className="flex gap-10">
            {/* Messages */}
            <div className="w-full">
              <label htmlFor="message">Message</label>
              <div>
                <div className="border border-black/25 rounded-t-[10px] overflow-hidden w-full h-[57px] bg-white flex items-center">
                  {/* Compose */}
                  <button
                    type="button"
                    onClick={() => handleTabClick("1")}
                    className={`w-full h-full flex items-center justify-center gap-3 text-sm ${
                      activeTab === "1"
                        ? "bg-pinks font-bold text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    Compose
                  </button>
                  {/* Attach Review Link */}
                  <button
                    type="button"
                    onClick={() => handleTabClick("2")}
                    className={`w-full h-full flex items-center justify-center gap-3 text-sm ${
                      activeTab === "2"
                        ? "bg-pinks font-bold text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    Attach review link
                  </button>
                  {/* Attach Payment Link */}
                  <button
                    type="button"
                    onClick={() => handleTabClick("3")}
                    className={`w-full h-full flex items-center justify-center gap-3 text-sm ${
                      activeTab === "3"
                        ? "bg-pinks font-bold text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    Attach payment link
                  </button>
                </div>
                {/* All Tabs */}
                <div>
                  {/* Compose Tab */}
                  {activeTab === "1" && (
                    <textarea
                      name="message"
                      value={reviewSmsData.message}
                      onChange={(e) => {
                        const message = e.target.value;
                        setreviewSmsData((prevData) => ({
                          ...prevData,
                          message,
                        }));
                      }}
                      placeholder="Enter message here..."
                      required
                      className="resize-none w-full h-[272px] p-4 rounded-b-[10px]"
                    ></textarea>
                  )}

                  {activeTab === "2" && (
                    <div className="h-[272px] bg-white px-4 pt-10">
                      <select
                        id="countries"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
                        value={reviewSmsData?.link_id}
                        onChange={handleSelectChange}
                      >
                        <option value="">Choose a review link</option>
                        {links?.map((link) => (
                          <option key={link?.id} value={link?.id}>
                            {link?.link_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {activeTab === "3" && <div>Payment Link</div>}
                </div>

                {/* Display Character and Page Count */}
                <div className="mt-2 text-sm flex w-full justify-end">
                  <p>
                    Page: {Math.ceil(reviewSmsData.message.length / 160)},
                    Characters left:{" "}
                    {160 - (reviewSmsData.message.length % 160)}, Total Typed
                    Characters: {reviewSmsData.message.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Display Message + Links */}
            <div className="w-[30rem]">
              <div className="bg-white p-4 rounded-[10px] h-full">
                <div className="bg-slate-500">
                  <p></p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <button
              className="border border-black/25 rounded-[10px] p-4 cursor-pointer bg-pinks text-white text-lg min-w-[653px]"
              onClick={sendReviewSms}
            >
              {Loading ? "Loading..." : "Send message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterpriseCompose;
