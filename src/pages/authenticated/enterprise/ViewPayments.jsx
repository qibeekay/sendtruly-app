import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import PageLoader from "../../../components/loaders/PageLoader";
import { useLocation, useParams } from "react-router-dom";
import { PaidCustomers } from "../../../api/text2pay";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Spinner } from "@chakra-ui/react";
import { formatDate } from "../../../utility/FormatDate";

const ViewPayments = () => {
  const { token } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [stat, setStat] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Access the passed review data
  const review = location.state?.review;

  // Fetch review data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await PaidCustomers(token);
      // console.log(result.data);
      setStat(result.data);
      setLoading(false);
    };
    fetchData();
  }, [token]);

  // console.log(stat);
  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRanges = stat.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <DashboardLayout pageName={"View Stats"}>
      <PageLoader isLoading={loading} />
      {/* header */}
      <div>
        <h1>
          All your customer behavior data, segmentation details, and activity,
          easily accessible in one place.
        </h1>

        {/* first section */}
        <div className="flex gap-4 justify-between shadow-lg bg-[#F4F7FB] p-4 sm:p-7 flex-col llg:flex-row">
          {/* sender id / date */}
          <div>
            <div>
              {/* sent date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-4">
                <h1 className="font-bold">Sent on</h1>
                <div className="border border-black/25 rounded-[8px] px-6 py-1 text-[#18A0FB]">
                  {review?.sent_at}
                </div>
              </div>

              {/* sender id */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-4">
                <h1 className="font-bold">Sender ID</h1>
                <div className="border border-black/25 rounded-[8px] px-6 py-1 text-[#18A0FB]">
                  {review?.sender_id}
                </div>
              </div>
            </div>
          </div>

          {/* message */}
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-4">
            <h1 className="font-bold">Message</h1>
            <div className="min-h-[86px] w-full sm:w-[450px] xl:w-[584px] border border-black/25 p-2">
              {review?.message}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col mt-10 w-full">
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                      Name
                    </th>
                    <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                      Email
                    </th>
                    <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                      Amount
                    </th>
                    <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                      Purpose
                    </th>
                    <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                      Reference
                    </th>
                    <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="p-5 text-center">
                        <div className="flex justify-center items-center py-8">
                          <Spinner size="xl" color="blue.500" />
                        </div>
                      </td>
                    </tr>
                  ) : stat.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-5 text-center text-gray-500">
                        <div className="py-8 flex flex-col items-center gap-2">
                          <HiOutlineFolderOpen size={40} />
                          No message found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentRanges.map((stat, index) => (
                      <tr
                        key={index}
                        className="transition-all duration-500 bg-white"
                      >
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {stat?.name}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {stat?.email}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {stat?.amount}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {stat?.purpose}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {stat?.reference}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {formatDate(stat?.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
                    length: Math.ceil(stat.length / itemsPerPage),
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
                disabled={currentPage === Math.ceil(stat.length / itemsPerPage)}
                className="flex items-center justify-center gap-2 px-3 h-8 ml-0 text-gray-500 bg-white font-medium text-base leading-7 hover:text-gray-700 disabled:opacity-50"
              >
                <HiChevronRight />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </DashboardLayout>
  );
};

export default ViewPayments;
