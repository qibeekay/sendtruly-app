import React, { useEffect, useState } from "react";
import { GetScheduledSms } from "../../api/sms";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineFolderOpen,
} from "react-icons/hi";
import { Spinner } from "@chakra-ui/react";

const GetScheduledMessages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  // Fetch groups on mount
  useEffect(() => {
    const getScheduleSms = async () => {
      setIsLoading(true);
      const result = await GetScheduledSms();
      setMessages(result.data.data);
      setIsLoading(false);
      setCurrentPage(1);
    };
    getScheduleSms();
  }, []);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMessages = messages.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-7">
      <div className="">
        <div className="w-full">
          <div className="min-w-full overflow-x-scroll">
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
                    MESSAGE
                  </th>
                  <th
                    scope="col"
                    className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                  >
                    SCHEDULED
                  </th>
                  <th
                    scope="col"
                    className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                  >
                    DELIVERY DATE
                  </th>
                  <th
                    scope="col"
                    className="p-5 text-right text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"
                  >
                    ACTIONS
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
                ) : messages.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-5 text-center text-gray-500">
                      <div className="py-8 flex flex-col items-center gap-2">
                        <HiOutlineFolderOpen size={40} />
                        No contact contacts found
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentMessages?.map((message, index) => (
                    <tr
                      key={index}
                      className="transition-all duration-500 odd:bg-[#F7F5EC] even:bg-white"
                    >
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        {message?.message_body}
                      </td>
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        {message?.schedule_details?.schedule_recurrence_type}
                      </td>
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        {message?.schedule_details?.scheduled_execution_time}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-end gap-1">
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
                    length: Math.ceil(messages.length / itemsPerPage),
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
                  currentPage === Math.ceil(messages.length / itemsPerPage)
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
  );
};

export default GetScheduledMessages;
