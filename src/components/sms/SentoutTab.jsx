import React, { useEffect, useState } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineFolderOpen,
} from "react-icons/hi";
import { formatDate } from "../../utility/FormatDate";
import { Spinner, useToast } from "@chakra-ui/react";
import { GetSentMessage, GetSingleReport } from "../../api/sms";

const SentoutTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [reports, setReports] = useState([]);
  const [showDeliveryReport, setShowDeliveryReport] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  const toast = useToast();

  // Fetch all sms delivery reports on mount
  useEffect(() => {
    const getReport = async () => {
      setIsLoading(true);
      const result = await GetSentMessage();
      setResults(result.data);
      setIsLoading(false);
    };
    getReport();
  }, []);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = results.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="w-full h-screen">
      <div>
        <div>
          <div>
            <h1>Message History</h1>
          </div>
        </div>

        <div className="flex flex-col mt-10 w-full">
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              {!showDeliveryReport && (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        ID
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        MESSAGE
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        MESSAGE TYPE
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        DELIVERY STATUS
                      </th>
                      <th className="p-5 text-right text-sm leading-6 font-semibold text-gray-900 capitalize">
                        DATE SENT
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
                    ) : results.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="p-5 text-center text-gray-500"
                        >
                          <div className="py-8 flex flex-col items-center gap-2">
                            <HiOutlineFolderOpen size={40} />
                            No message found
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentResults.map((range, index) => (
                        <tr
                          key={index}
                          className="transition-all duration-500 odd:bg-[#F7F5EC] even:bg-white"
                        >
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {range?.message}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {range?.message_type}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {range?.delivery_status}
                          </td>
                          <td className="p-5 text-right whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {range?.created_at}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
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
                  length: Math.ceil(results.length / itemsPerPage),
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
                currentPage === Math.ceil(results.length / itemsPerPage)
              }
              className="flex items-center justify-center gap-2 px-3 h-8 ml-0 text-gray-500 bg-white font-medium text-base leading-7 hover:text-gray-700 disabled:opacity-50"
            >
              <HiChevronRight />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SentoutTab;
