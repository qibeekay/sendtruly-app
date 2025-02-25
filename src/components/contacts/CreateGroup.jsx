import { HiOutlineEye, HiOutlineFolderOpen, HiX } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPenLine } from "react-icons/lu";
import { Spinner, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { GetAllList } from "../../api/contact";
import { MdPersonAddAlt } from "react-icons/md";
import AddContactModal from "./AddContactModal";
import { RefreshContext } from "../../utility/RefreshContext";
import UploadBulkModal from "./UploadBulkModal";
import DeleteGroupModal from "./DeleteGroupModal";

const CreateGroup = ({ setmodal }) => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const { refreshCounter } = useContext(RefreshContext);

  const toast = useToast();

  // Function to open modal with group data
  const openModal = (listToken) => {
    setSelectedToken(listToken); // Set the selected group
    setIsModalOpen(true); // Open the modal
  };

  const openModal1 = () => {
    setIsModal1Open(true); // Open the modal
  };

  const openModal2 = (listToken) => {
    setSelectedToken(listToken); // Set the selected group
    setIsModal2Open(true); // Open the modal
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedToken(null);
    setIsModalOpen(false); // Close the modal
  };

  const closeModal1 = () => {
    setIsModal1Open(false); // Close the modal
  };

  const closeModal2 = () => {
    setSelectedToken(null);
    setIsModal2Open(false); // Close the modal
  };

  // Function to get all list
  const getAllList = async () => {
    setIsLoading(true);
    const result = await GetAllList();
    setGroups(result.data);
    setIsLoading(false);
  };

  // Fetch data when refreshCounter changes
  useEffect(() => {
    getAllList();
  }, [refreshCounter]);

  return (
    <div className="bg-white min-h-screen w-full llg:w-[80%] rounded-[10px]">
      <div className="p-[4rem]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-[24px] pb-2">Contact Groups</h1>
            <p>An overview of your contact groups</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openModal1}
              className="border border-pinks rounded-[10px] text-pinks px-6 py-4 bg-white hover:bg-pinks/10 duration-300 ease-in-out"
            >
              Upload bulk Contacts
            </button>
            <button
              onClick={setmodal}
              className="border border-pinks rounded-[10px] text-white px-6 py-4 bg-pinks hover:bg-pinks/80 duration-300 ease-in-out"
            >
              Create New Group
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col mt-10">
          <div className="overflow-x-auto">
            <div className="w-full">
              <div className="overflow-hidden">
                <table className="w-full rounded-xl border-b">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
                        ID
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        NAME
                      </th>
                      <th className="p-5 text-right text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {isLoading ? (
                      <tr>
                        <td colSpan="3" className="p-5 text-center">
                          <div className="flex justify-center items-center py-8">
                            <Spinner size="xl" color="blue.500" />
                          </div>
                        </td>
                      </tr>
                    ) : groups?.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="p-5 text-center text-gray-500"
                        >
                          <div className="py-8 flex flex-col items-center gap-2">
                            <HiOutlineFolderOpen size={40} />
                            No contact groups found
                          </div>
                        </td>
                      </tr>
                    ) : (
                      groups?.map((group, index) => (
                        <tr
                          key={index}
                          className="bg-white transition-all duration-500 hover:bg-gray-50"
                        >
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              <p>{group?.list_name}</p>
                              <p className="bg-pinks/10 text-pinks font-semibold py-0.5 px-5 rounded-[10rem]">
                                {group?.total_numbers}
                              </p>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openModal(group?.list_token)}
                                className="p-2 rounded-full group transition-all duration-500 flex items-center"
                              >
                                <MdPersonAddAlt size={25} />
                              </button>
                              <button
                                onClick={() => openModal2(group?.list_token)}
                                className="p-2 rounded-full group transition-all duration-500 flex items-center"
                              >
                                <RiDeleteBin6Line size={25} color="red" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddContactModal
          isOpen={isModalOpen}
          onClose={closeModal}
          list_token={selectedToken}
        />
        <UploadBulkModal
          isOpen={isModal1Open}
          onClose={closeModal1}
          groups={groups}
        />
        <DeleteGroupModal
          isOpen={isModal2Open}
          onClose={closeModal2}
          list_token={selectedToken}
        />
      </div>
    </div>
  );
};

export default CreateGroup;
