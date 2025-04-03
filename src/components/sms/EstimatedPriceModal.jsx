import React, { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { AddUserToList } from "../../api/contact";
import { SendPersonalisedSms, SendSms } from "../../api/sms";
import { useToast } from "@chakra-ui/react";

const EstimatedPriceModal = ({
  isOpen,
  onClose,
  estimate,
  loading,
  smsData,
  fetchEstimate,
  isPersonalised,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showFailedContacts, setShowFailedContacts] = useState(false);
  const [failedContacts, setFailedContacts] = useState([]);
  const [sendSuccess, setSendSuccess] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchEstimate();
      // Reset states when modal opens
      setShowFailedContacts(false);
      setFailedContacts([]);
      setSendSuccess(false);
    }
  }, [isOpen]);

  const sendBulkSms = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = isPersonalised
      ? await SendPersonalisedSms({
          ...smsData,
          sms_cost: estimate?.estimated_price,
        })
      : await SendSms({
          ...smsData,
          sms_cost: estimate?.estimated_price,
        });

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    setIsLoading(false);

    if (result.success) {
      setSendSuccess(true);
      // Check if there are failed contacts in the response
      if (
        result.data?.failed_contacts &&
        result.data.failed_contacts.length > 0
      ) {
        setFailedContacts(result.data.failed_contacts);
        setShowFailedContacts(true);
      } else {
        onClose(); // Close modal if no failed contacts
      }
    }
  };

  const closeFailedContactsModal = () => {
    setShowFailedContacts(false);
    onClose(); // Close the main modal as well
  };

  return (
    <>
      {/* Main SMS Summary Modal */}
      <div
        className={`fixed left-0 top-0 w-full bg-black/50 min-h-screen z-[100] items-center justify-center ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        <div className="bg-white font-poppins p-7 rounded-[10px] w-[40rem]">
          <div>
            <button className="w-full flex justify-end mb-4" onClick={onClose}>
              <HiX size={25} />
            </button>

            <h1 className="text-[24px] text-center">SMS ANALYSIS SUMMARY</h1>

            {loading ? (
              <div className="py-10">Loading...</div>
            ) : (
              <div className="flex justify-center gap-4 py-10">
                {/* total cost */}
                <div className="border rounded-[10px] p-5 min-w-[11rem] flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-semibold text-[24px]">
                      {estimate?.currency}
                      {estimate?.estimated_price}
                    </p>
                    <p className="text-sm">SMS COST</p>
                  </div>
                </div>

                {/* total contacts */}
                <div className="border rounded-[10px] p-5 min-w-[8rem] flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-semibold text-[24px]">
                      {estimate?.total_contacts}
                    </p>
                    <p className="text-sm">CONTACTS</p>
                    <p className="text-xs">{estimate?.delivery_route}</p>
                  </div>
                </div>

                {/* number of pages */}
                <div className="border rounded-[10px] p-5 min-w-[11rem] flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-semibold text-[24px]">
                      {estimate?.pages}
                    </p>
                    <p className="text-sm">PAGE</p>
                    <p className="text-xs">
                      ({estimate?.total_characters} characters)
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                onClick={sendBulkSms}
                className="border border-black/25 rounded-[10px] p-4 w-full cursor-pointer bg-pinks text-white text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Failed Contacts Modal */}
      {showFailedContacts && (
        <div className="fixed left-0 top-0 w-full bg-black/50 min-h-screen z-[101] flex items-center justify-center">
          <div className="bg-white h-[30rem] font-poppins p-7 rounded-[10px] overflow-y-scroll hide-scroll w-[40rem]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[20px] font-semibold">Failed Contacts</h2>
              <button onClick={closeFailedContactsModal}>
                <HiX size={25} />
              </button>
            </div>

            <div className="mb-4">
              <p>
                {sendSuccess
                  ? "SMS sent successfully with some failures:"
                  : "Failed to send SMS to the following contacts:"}
              </p>
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left border">Contact</th>
                    <th className="p-2 text-left border">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {failedContacts.map((contact, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 border">{contact.contact}</td>
                      <td className="p-2 border">{contact.error_message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <button
                onClick={closeFailedContactsModal}
                className="border border-black/25 rounded-[10px] p-4 w-full cursor-pointer bg-pinks text-white text-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EstimatedPriceModal;
