import React, { useEffect, useState } from "react";
import {
  GetAllContacts,
  GetAllList,
  GetContactsByToken,
} from "../../api/contact";
import { HiOutlineEye, HiOutlineFolderOpen } from "react-icons/hi";
import { Spinner, useToast } from "@chakra-ui/react";
import { MdArrowDropDown, MdPersonAddAlt } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

const AllContactsTable = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedListToken, setSelectedListToken] = useState(null); // State for selected list_token
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const toast = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // function to get all list
  useEffect(() => {
    const fetchLists = async () => {
      setIsLoading(true);
      const result = await GetAllList();
      setGroups(result.data);
      setIsLoading(false);
    };
    fetchLists();
  }, []);

  // function to fetch contacts API

  const fetchContacts = async () => {
    setIsLoading(true);
    let result;
    if (selectedListToken === null) {
      result = await GetAllContacts();
    } else {
      result = await GetContactsByToken({ list_token: selectedListToken });
    }
    if (result.success) {
      setContacts(result.data.contacts);
    }
    setIsLoading(false);
  };

  // Fetch data when selectedListToken changes
  useEffect(() => {
    fetchContacts();
  }, [selectedListToken]);

  // Filter groups based on search term
  const filteredGroups = groups?.filter((group) =>
    group.list_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen w-full llg:w-[80%] rounded-[10px]">
      <div className="p-[4rem]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-[24px] pb-2">Contact contacts</h1>
            <p>An overview of your contact contacts</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="border border-gray-300 rounded-md px-6 py-4 flex items-center gap-2 bg-white hover:bg-gray-100"
              >
                {selectedListToken === null
                  ? "All"
                  : groups.find((g) => g.list_token === selectedListToken)
                      ?.list_name}
                <MdArrowDropDown size={20} />
              </button>
              {dropdownOpen && (
                <ul className="absolute top-full -left-4 bg-white border rounded-md shadow-md w-[15rem] mt-1 max-h-[20rem] overflow-y-scroll">
                  <li className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-2 py-1 border rounded-md"
                    />
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedListToken(null);
                      setDropdownOpen(false);
                    }}
                  >
                    All
                  </li>
                  {filteredGroups.map((group) => (
                    <li
                      key={group.list_token}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedListToken(group.list_token);
                        setDropdownOpen(false);
                      }}
                    >
                      {group.list_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              //   onClick={setmodal}
              className="border border-pinks rounded-[10px] text-white px-6 py-4 bg-pinks hover:bg-pinks/80 duration-300 ease-in-out"
            >
              Add Contacts
            </button>
          </div>
        </div>

        {/* table */}
        <div className="flex flex-col mt-10">
          <div className="overflow-x-auto">
            <div className="w-full">
              <div className="overflow-x-scroll">
                <table className="w-full rounded-xl border-b">
                  <thead>
                    <tr className="bg-gray-50">
                      <th
                        scope="col"
                        className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                      >
                        NAME
                      </th>
                      <th
                        scope="col"
                        className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                      >
                        PHONE
                      </th>
                      <th
                        scope="col"
                        className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                      >
                        EMAIL
                      </th>
                      <th
                        scope="col"
                        className="p-5 text-right text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="p-5 text-center">
                          <div className="flex justify-center items-center py-8">
                            <Spinner size="xl" color="blue.500" />
                          </div>
                        </td>
                      </tr>
                    ) : contacts.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-5 text-center text-gray-500"
                        >
                          <div className="py-8 flex flex-col items-center gap-2">
                            <HiOutlineFolderOpen size={40} />
                            No contact contacts found
                          </div>
                        </td>
                      </tr>
                    ) : (
                      contacts?.map((contact, index) => (
                        <tr
                          key={index}
                          className="bg-white transition-all duration-500 hover:bg-gray-50"
                        >
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {contact?.contact}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {contact?.number}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {contact?.email}
                          </td>
                          <td className="p-5">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                // onClick={() => openModal(contact?.list_token)}
                                className="p-2 rounded-full group transition-all duration-500 flex item-center"
                              >
                                <MdPersonAddAlt size={25} />
                              </button>
                              <button className="p-2 rounded-full group transition-all duration-500 flex item-center">
                                <HiOutlineEye size={25} />
                              </button>
                              <button className="p-2 rounded-full group transition-all duration-500 flex item-center">
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
                className="flex items-center justify-center py-4"
                aria-label="Table navigation"
              >
                <ul className="flex items-center justify-center text-sm h-auto gap-12">
                  <li>
                    <a
                      href="javascript:;"
                      className="flex items-center justify-center gap-2 px-3 h-8 ml-0 text-gray-500 bg-white font-medium text-base leading-7 hover:text-gray-700"
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
                      </svg>
                    </a>
                  </li>
                  <li>
                    <ul className="flex items-center justify-center gap-4">
                      <li>
                        <a
                          href="javascript:;"
                          className="font-normal text-base leading-7 text-gray-500 py-2.5 px-4 rounded-full bg-white transition-all duration-500 hover:bg-indigo-600 hover:text-white"
                        >
                          1
                        </a>
                      </li>

                      <li>
                        <a
                          href="javascript:;"
                          className="font-normal text-base leading-7 text-gray-500 py-2.5 px-4 rounded-full"
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
                      className="flex items-center justify-center gap-2 px-3 h-8 ml-0 text-gray-500 bg-white font-medium text-base leading-7 hover:text-gray-700"
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
        {/* <AddContactModal
          isOpen={isModalOpen}
          onClose={closeModal}
          list_token={selectedToken}
        /> */}
      </div>
    </div>
  );
};

export default AllContactsTable;
