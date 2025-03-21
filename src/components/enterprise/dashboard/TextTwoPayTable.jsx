import React, { useEffect, useState } from "react";
import { GetReviews } from "../../../api/reviews";
import { Spinner } from "@chakra-ui/react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineFolderOpen,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { GetMessages } from "../../../api/text2pay";

const TextTwoPayTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  useEffect(() => {
    const getMessage = async () => {
      setIsLoading(true);
      const result = await GetMessages();
      setReviews(result.data.data);
      setIsLoading(false);
    };
    getMessage();
  }, []);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRanges = reviews.slice(indexOfFirstItem, indexOfLastItem);

  // Navigate to view stats and pass review data
  const viewStats = (review) => {
    navigate(`/dashboard/enterprise/payments/${review.token}`, {
      state: { review }, // Pass the entire review object as state
    });
  };

  // Pagination function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div>
      <div className="flex flex-col mt-10 w-full">
        <div className="w-full overflow-x-auto">
          <div className="min-w-full">
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
                    Date
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"></th>
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
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-5 text-center text-gray-500">
                      <div className="py-8 flex flex-col items-center gap-2">
                        <HiOutlineFolderOpen size={40} />
                        No message found
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentRanges.map((review, index) => (
                    <tr
                      key={index}
                      className="transition-all duration-500 bg-white"
                    >
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        {review?.sender_id}
                      </td>
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        {review?.message}
                      </td>
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        {review?.sent_at}
                      </td>
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => viewStats(review)} // Pass the review object
                            className={`py-1.5 px-10 shadow-lg text-white bg-pinks `}
                          >
                            View Stats
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
                  length: Math.ceil(reviews.length / itemsPerPage),
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
                currentPage === Math.ceil(reviews.length / itemsPerPage)
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

export default TextTwoPayTable;
