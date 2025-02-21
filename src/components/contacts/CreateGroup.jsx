import { HiOutlineEye, HiOutlineFolderOpen, HiX } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPenLine } from "react-icons/lu";
import { Spinner, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { GetAllList } from "../../api/contact";
import { MdPersonAddAlt } from "react-icons/md";
import AddContactModal from "./AddContactModal";
import { RefreshContext } from "../../utility/RefreshContext";

const CreateGroup = ({ setmodal }) => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const { refreshCounter } = useContext(RefreshContext);

  const toast = useToast();

  // Function to open modal with group data
  const openModal = (listToken) => {
    setSelectedToken(listToken); // Set the selected group
    setIsModalOpen(true); // Open the modal
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedToken(null); // Clear the selected group
    setIsModalOpen(false); // Close the modal
  };

  // function to get all list
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
            <button className="border border-pinks rounded-[10px] text-pinks px-6 py-4 bg-white hover:bg-pinks/10 duration-300 ease-in-out">
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

        {/* table */}
        <div class="flex flex-col mt-10">
          <div class=" overflow-x-auto">
            <div class="w-full">
              <div class="overflow-hidden ">
                <table class="w-full rounded-xl border-b">
                  <thead>
                    <tr class="bg-gray-50">
                      <th
                        scope="col"
                        class="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        class="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                      >
                        NAME
                      </th>
                      <th
                        scope="col"
                        class="p-5 text-right text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-300 ">
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
                          class="bg-white transition-all duration-500 hover:bg-gray-50"
                        >
                          <td class="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
                            {index + 1}
                          </td>
                          <td class="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              <p>{group?.list_name}</p>
                              <p className="bg-pinks/10 text-pinks font-semibold py-0.5 px-5 rounded-[10rem]">
                                {group?.total_numbers}
                              </p>
                            </div>
                          </td>
                          <td class=" p-5">
                            <div class="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openModal(group?.list_token)}
                                class="p-2  rounded-full  group transition-all duration-500  flex item-center"
                              >
                                <MdPersonAddAlt size={25} />
                              </button>
                              <button class="p-2  rounded-full  group transition-all duration-500  flex item-center">
                                <HiOutlineEye size={25} />
                              </button>
                              <button class="p-2 rounded-full  group transition-all duration-500  flex item-center">
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

              {/* pagination */}
              <nav
                class="flex items-center justify-center py-4 "
                aria-label="Table navigation"
              >
                <ul class="flex items-center justify-center text-sm h-auto gap-12">
                  <li>
                    <a
                      href="javascript:;"
                      class="flex items-center justify-center gap-2 px-3 h-8 ml-0 text-gray-500 bg-white font-medium text-base leading-7  hover:text-gray-700 "
                    >
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.0002 14.9999L8 9.99967L13.0032 4.99652"
                          stroke="black"
                          stroke-width="1.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>{" "}
                    </a>
                  </li>
                  <li>
                    <ul class="flex items-center justify-center gap-4">
                      <li>
                        <a
                          href="javascript:;"
                          class="font-normal text-base leading-7 text-gray-500 py-2.5 px-4 rounded-full bg-white transition-all duration-500 hover:bg-indigo-600 hover:text-white"
                        >
                          1
                        </a>
                      </li>

                      <li>
                        <a
                          href="javascript:;"
                          class="font-normal text-base leading-7 text-gray-500 py-2.5 px-4 rounded-full "
                        >
                          <svg
                            width="21"
                            height="20"
                            viewBox="0 0 21 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.52754 10.001H5.47754M10.5412 10.001H10.4912M15.5549 10.001H15.5049"
                              stroke="black"
                              stroke-width="2.5"
                              stroke-linecap="round"
                            ></path>
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      href="javascript:;"
                      class="flex items-center justify-center gap-2 px-3 h-8 ml-0 text-gray-500 bg-white font-medium text-base leading-7  hover:text-gray-700 "
                    >
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00295 4.99646L13.0032 9.99666L8 14.9998"
                          stroke="black"
                          stroke-width="1.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* create group modal */}
        {/* Modal displays form to create a group */}
        <AddContactModal
          isOpen={isModalOpen}
          onClose={closeModal}
          list_token={selectedToken}
        />
      </div>
    </div>
  );
};

export default CreateGroup;
