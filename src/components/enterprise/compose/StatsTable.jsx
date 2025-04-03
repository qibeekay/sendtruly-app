import { Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineFolderOpen,
} from "react-icons/hi";

const StatsTable = ({ details = [], isLoading }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  //console.log(details);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRanges = details.slice(indexOfFirstItem, indexOfLastItem);

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
                    Phone number
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                    Comment
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                    Ratings
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                    Time
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
                ) : details.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-5 text-center text-gray-500">
                      <div className="py-8 flex flex-col items-center gap-2">
                        <HiOutlineFolderOpen size={40} />
                        No message found
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentRanges.map((stats, index) => (
                    <tr
                      key={index}
                      className="transition-all duration-500 bg-white"
                    >
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        {stats?.number}
                      </td>
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        {stats?.comment}
                      </td>
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        {stats?.review_ratings}/5
                      </td>
                      <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        {stats?.created_at}
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
                  length: Math.ceil(details.length / itemsPerPage),
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
                currentPage === Math.ceil(details.length / itemsPerPage)
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

export default StatsTable;
