import React from "react";
import { useTabContext } from "../../../utility/TabContext";
import ReviewTable from "./ReviewTable";

const ReviewHistory = () => {
  const { activeTab, setTab } = useTabContext();

  const handleTabClick = (tab) => {
    setTab(tab);
  };

  return (
    <div>
      <div>
        {/* buttons */}
        <div className="flex items-center gap-10 my-10">
          <button
            onClick={() => handleTabClick("1")}
            className={`flex items-center justify-center w-[130px] h-[51px] border border-pinks text-sm rounded-[5px] ${
              activeTab === "1"
                ? "bg-pinks font-bold text-white"
                : "bg-white text-pinks"
            }`}
          >
            Review
          </button>
          <button
            onClick={() => handleTabClick("2")}
            className={`flex items-center justify-center w-[130px] h-[51px] border border-pinks text-sm rounded-[5px] ${
              activeTab === "2"
                ? "bg-pinks font-bold text-white"
                : "bg-white text-pinks"
            }`}
          >
            Sent SMS History
          </button>
          <button
            onClick={() => handleTabClick("3")}
            className={`flex items-center justify-center w-[130px] h-[51px] border border-pinks rounded-[5px] text-sm ${
              activeTab === "3"
                ? "bg-pinks font-bold text-white"
                : "bg-white text-pinks"
            }`}
          >
            Sent Text2Pay
          </button>
        </div>

        {/* tabs  */}
        <div>
          {activeTab === "1" && (
            <div>
              {" "}
              <ReviewTable />
            </div>
          )}
          {activeTab === "2" && <div> hello 222 </div>}
          {activeTab === "3" && <div> hello 333 </div>}
        </div>
      </div>
    </div>
  );
};

export default ReviewHistory;
