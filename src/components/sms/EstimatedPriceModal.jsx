import React, { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { AddUserToList } from "../../api/contact";
import { SendSms } from "../../api/sms";
import { useToast } from "@chakra-ui/react";

const EstimatedPriceModal = ({
  isOpen,
  onClose,
  estimate,
  loading,
  smsData,
  fetchEstimate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // useEffect(() => {
  //   if (isOpen) {
  //     fetchEstimate();
  //   }
  // }, [isOpen]);

  console.log("sms", smsData);
  // function to upload contacts
  const sendBulkSms = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await SendSms({
      ...smsData,
      sms_cost: estimate?.estimated_price,
    });

    console.log(result);
    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    // if (result.success) {
    //   onClose();
    //   setContactsList([]);
    // }

    setIsLoading(false);
  };
  return (
    <div
      className={`fixed left-0 top-0 w-full bg-black/50 min-h-screen z-[100] items-center justify-center ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="bg-white font-poppins p-7 rounded-[10px] w-[40rem]">
        <div>
          {/* close button */}
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
                  <p className="font-semibold text-[24px]">{estimate?.pages}</p>
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
            >
              {isLoading ? "Loading..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatedPriceModal;
