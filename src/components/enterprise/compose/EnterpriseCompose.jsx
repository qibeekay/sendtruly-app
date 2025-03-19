import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { GetAllList } from "../../../api/contact";
import { useTabContext } from "../../../utility/TabContext";
import { GetReviewLinks, SendReviewSms } from "../../../api/reviews";
import { GetPaymentLinks, SendPaymentSms } from "../../../api/text2pay";

const EnterpriseCompose = () => {
  const [groups, setGroups] = useState([]);
  const [links, setLinks] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [selectedListTokens, setSelectedListTokens] = useState("");
  const userData = JSON.parse(localStorage.getItem("data_user_main"));

  // Handles tabs
  const { activeTab, setTab } = useTabContext();

  const handleTabClick = (tab) => {
    setTab(tab);
  };

  const toast = useToast();

  const [reviewSmsData, setReviewSmsData] = useState({
    sender_id: "",
    message: "",
    list_id: "",
    link_id: "",
    delivery_route: "4",
    message_type: "0",
    sms_cost: 0,
    link_type: "external",
  });

  const [paymentSmsData, setPaymentSmsData] = useState({
    sender_id: "",
    message: "",
    list_id: "",
    invoice_token: "",
  });

  // Track the selected link and invoice details
  const [selectedLink, setSelectedLink] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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

  // Update reviewSmsData and paymentSmsData when selectedListTokens changes
  useEffect(() => {
    setReviewSmsData((prevData) => ({
      ...prevData,
      list_id: selectedListTokens,
    }));
    setPaymentSmsData((prevData) => ({
      ...prevData,
      list_id: selectedListTokens,
    }));
  }, [selectedListTokens]);

  // Handle SMS input change for reviewSmsData
  const smsInputChange = (event) => {
    const { name, value } = event.target;
    setReviewSmsData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setPaymentSmsData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle link selection
  const handleSelectChange = (event) => {
    const selectedLinkId = event.target.value;
    const selectedLinkDetails = links.find(
      (link) => link.id === Number(selectedLinkId)
    );

    setReviewSmsData((prev) => ({
      ...prev,
      link_id: selectedLinkId,
    }));

    setSelectedLink(selectedLinkDetails);
    setSelectedInvoice(null); // Clear selected invoice when a review link is selected
  };

  // Handle invoice selection
  const handleInvoiceSelectChange = (event) => {
    const selectedInvoiceToken = event.target.value;
    const selectedInvoiceDetails = invoices.find(
      (invoice) => invoice.token === selectedInvoiceToken
    );

    setPaymentSmsData((prev) => ({
      ...prev,
      invoice_token: selectedInvoiceToken,
    }));

    setSelectedInvoice(selectedInvoiceDetails);
    setSelectedLink(null); // Clear selected link when an invoice is selected
  };

  // Fetch all review links and invoices
  const fetchLinks = async () => {
    setIsLoading(true);
    const result = await GetReviewLinks();
    setLinks(result.data.data);
    setIsLoading(false);
  };

  const fetchInvoices = async () => {
    setIsLoading(true);
    const result = await GetPaymentLinks();
    setInvoices(result.data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLinks();
    fetchInvoices();
  }, []);

  // Function to send SMS based on selected link or invoice
  const sendSms = async (e) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (selectedLink) {
      // Send review SMS
      result = await SendReviewSms(reviewSmsData);
    } else if (selectedInvoice) {
      // Send payment SMS
      result = await SendPaymentSms(paymentSmsData);
    } else {
      // No link or invoice selected
      toast({
        title: "Error",
        description: "Please select a review link or an invoice.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    //console.log("SMS result:", result);
    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });
    setLoading(false);
  };

  // Format the message and link/invoice for display
  const formattedMessage = (
    <div>
      <p>Hi Receiver's name,</p>
      <p className="py-2">{reviewSmsData.message}</p>
      {selectedLink && (
        <p>
          Click the link below:{" "}
          <span className="text-blue-500">{selectedLink.review_url}</span>
        </p>
      )}
      {selectedInvoice && (
        <p>
          Invoice Details:{" "}
          <span className="text-blue-500">
            {selectedInvoice.title} - NGN{selectedInvoice.total_price}
          </span>
        </p>
      )}
    </div>
  );

  return (
    <div>
      <div className="">
        {/* Form */}
        <form action="" className="w-full flex flex-col gap-4">
          {/* Sender ID / Contacts List */}
          <div className="flex flex-col md:flex-row gap-10">
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
            <div className="w-full md:w-[30rem]">
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
          <div className="flex flex-col md:flex-row gap-10">
            {/* Messages */}
            <div className="w-full ">
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
                  {/* Attach Invoice */}
                  <button
                    type="button"
                    onClick={() => handleTabClick("3")}
                    className={`w-full h-full flex items-center justify-center gap-3 text-sm ${
                      activeTab === "3"
                        ? "bg-pinks font-bold text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    Attach invoice
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
                        setReviewSmsData((prevData) => ({
                          ...prevData,
                          message,
                        }));
                        setPaymentSmsData((prevData) => ({
                          ...prevData,
                          message,
                        }));
                      }}
                      placeholder="Enter message here..."
                      required
                      className="resize-none w-full h-[272px] p-4 rounded-b-[10px]"
                    ></textarea>
                  )}

                  {/* Attach Review Link Tab */}
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

                  {/* Attach Invoice Tab */}
                  {activeTab === "3" && (
                    <div className="h-[272px] bg-white px-4 pt-10">
                      <select
                        id="invoices"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
                        value={paymentSmsData?.invoice_token}
                        onChange={handleInvoiceSelectChange}
                      >
                        <option value="">Choose an invoice</option>
                        {invoices?.map((invoice) => (
                          <option key={invoice?.token} value={invoice?.token}>
                            {invoice?.title} - NGN{invoice?.total_price}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
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

            {/* Display Message + Links/Invoices */}
            <div className="w-full md:w-[30rem]">
              <div className="bg-white p-4 rounded-[10px] h-full">
                <div className="bg-[#D9D9D9] text-black p-4 rounded-[10px]">
                  {formattedMessage}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <button
              className="border border-black/25 rounded-[10px] p-4 cursor-pointer bg-pinks text-white text-lg w-full md:w-[653px]"
              onClick={sendSms}
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
