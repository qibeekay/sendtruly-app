import React, { useContext, useState } from "react";
import { RefreshContext } from "../../utility/RefreshContext";
import { useToast } from "@chakra-ui/react";
import { DeleteGroup } from "../../api/contact";
import { HiX } from "react-icons/hi";

const DeleteGroupModal = ({ isOpen, onClose, list_token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { triggerRefresh } = useContext(RefreshContext);
  const toast = useToast();

  // Function to delete group
  const deleteContacts = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await DeleteGroup({ list_token: String(list_token) });

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    if (result.success) {
      onClose(); // Close the modal
      triggerRefresh(); // Trigger refresh
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

          <h1 className="text-[24px]">Delete Group</h1>

          <p className="pt-10 font-medium text-lg">
            Are you sure you want to delete this group?
          </p>

          <form onSubmit={deleteContacts}>
            {/* Upload button */}
            <div className="flex flex-col gap-4 mt-10">
              <button
                type="submit"
                className="border border-[#ef4444] rounded-[10px] text-white px-6 py-4 bg-[#ef4444] hover:bg-[#ef4444]/80 duration-300 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteGroupModal;
