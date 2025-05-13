import React, { useEffect, useState } from "react";
import { GetDeliveryReport, GetSingleReport } from "../../api/sms";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineFolderOpen,
} from "react-icons/hi";
import { Spinner, useToast } from "@chakra-ui/react";
import { formatDate } from "../../utility/FormatDate";

const SentMessageTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ranges, setRanges] = useState([]);
  const [reports, setReports] = useState([]);
  const [showDeliveryReport, setShowDeliveryReport] = useState(false);

  // Pagination statessss
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  const toast = useToast();

  // Fetch all sms delivery reports on mount
  useEffect(() => {
    const getReport = async () => {
      setIsLoading(true);
      const result = await GetDeliveryReport();
      setRanges(result.data.date_ranges);
      setIsLoading(false);
    };
    getReport();
  }, []);

  // Function to fetch single SMS report
  const viewSingleReport = async (dateRange) => {
    setLoading(true);
    const result = await GetSingleReport(dateRange);

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    setShowDeliveryReport(true);
    setReports(result.data.delivery_reports);
    setLoading(false);
    setCurrentPage(1); // Reset to the first page when viewing a new report
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRanges = ranges.slice(indexOfFirstItem, indexOfLastItem);
  const currentReports = reports.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentRanges);

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
                        Date Ranges
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Message Batches
                      </th>
                      <th className="p-5 text-right text-sm leading-6 font-semibold text-gray-900 capitalize">
                        View
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
                    ) : ranges.length === 0 ? (
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
                      currentRanges.map((range, index) => (
                        <tr
                          key={index}
                          className="transition-all duration-500 odd:bg-[#F7F5EC] even:bg-white"
                        >
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {range}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            20
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => viewSingleReport(range)}
                                disabled={loading}
                                className={`py-1.5 px-10 text-black shadow-lg ${
                                  index % 2 === 0 ? "bg-white" : "bg-[#d9d9d9]"
                                }`}
                              >
                                View Messages
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* DELIVERY REPORT TABLE */}
          {showDeliveryReport && (
            <div>
              <button
                onClick={() => setShowDeliveryReport(false)}
                className="mb-4 py-2 px-6 bg-gray-300 rounded-[10px] shadow-md"
              >
                Back to Message History
              </button>
              <div className="min-w-full overflow-x-scroll">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Sender ID
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Message
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Message Type
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Recipient
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Sent Time
                      </th>
                      <th className="p-5 text-right text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="p-5 text-center">
                          <div className="flex justify-center items-center py-8">
                            <Spinner size="xl" color="blue.500" />
                          </div>
                        </td>
                      </tr>
                    ) : reports.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="p-5 text-center text-gray-500"
                        >
                          <div className="py-8 flex flex-col items-center gap-2">
                            <HiOutlineFolderOpen size={40} />
                            No message found
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentReports.map((report, index) => (
                        <tr
                          key={index}
                          className="transition-all duration-500 odd:bg-[#F7F5EC] even:bg-white"
                        >
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {report?.sender_id}
                          </td>
                          <td className="p-5 text-sm leading-6 font-medium text-gray-900">
                            {report?.message}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {report?.message_type}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {report?.recipients}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {formatDate(report?.sent_time)}
                          </td>
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            <div className="flex items-center justify-end gap-1">
                              {report?.delivery_status}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
                  length: Math.ceil(
                    (showDeliveryReport ? reports.length : ranges.length) /
                      itemsPerPage
                  ),
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
                Math.ceil(
                  (showDeliveryReport ? reports.length : ranges.length) /
                    itemsPerPage
                )
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

export default SentMessageTab;
