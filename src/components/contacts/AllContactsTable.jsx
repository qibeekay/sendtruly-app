import React, { useEffect, useState } from "react";
import {
  GetAllContacts,
  GetAllList,
  GetContactsByToken,
} from "../../api/contact";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineEye,
  HiOutlineFolderOpen,
} from "react-icons/hi";
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

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
    setCurrentPage(1);
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

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRanges = contacts.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white min-h-screen w-full llg:w-[80%] rounded-[10px]">
      <div className="p-[4rem]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-[24px] pb-2">Contacts</h1>
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
                        className="p-5 text-right text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"
                      >
                        EMAIL
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
                      currentRanges?.map((contact, index) => (
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
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 flex items-end justify-end">
                            {contact?.email}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <nav className="flex items-center justify-center py-4">
                <ul className="flex items-center justify-center text-sm h-auto gap-12">
                  <li>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center gap-2 px-3 h-8 ml-0 text-gray-500 bg-white font-medium text-base leading-7 hover:text-gray-700 disabled:opacity-50"
                    >
                      <HiChevronLeft />
                    </button>
                  </li>
                  <li>
                    <ul className="flex items-center justify-center gap-4">
                      {Array.from(
                        {
                          length: Math.ceil(contacts.length / itemsPerPage),
                        },
                        (_, i) => (
                          <li key={i + 1} className="">
                            <button
                              onClick={() => paginate(i + 1)}
                              className={`font-normal text-base leading-7 w-[2rem] aspect-square rounded-full ${
                                currentPage === i + 1
                                  ? "bg-indigo-600 text-white"
                                  : "bg-white text-gray-500"
                              } transition-all duration-500 hover:bg-indigo-600 hover:text-white`}
                            >
                              {i + 1}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </li>
                  <li>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(contacts.length / itemsPerPage)
                      }
                      className="flex items-center justify-center gap-2 px-3 h-8 ml-0 text-gray-500 bg-white font-medium text-base leading-7 hover:text-gray-700 disabled:opacity-50"
                    >
                      <HiChevronRight />
                    </button>
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
