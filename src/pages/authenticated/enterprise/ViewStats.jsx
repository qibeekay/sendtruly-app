import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import PageLoader from "../../../components/loaders/PageLoader";
import { useParams, useLocation } from "react-router-dom";
import { ReviewStats } from "../../../api/reviews";
import StatsTable from "../../../components/enterprise/compose/StatsTable";

const ViewStats = () => {
  const { token } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [stat, setStat] = useState({});

  // Access the passed review data
  const review = location.state?.review;

  // Fetch review data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await ReviewStats(token);
      //console.log(result.data);
      setStat(result.data);
      setLoading(false);
    };
    fetchData();
  }, [token]);

  //console.log(stat?.feedbacks?.feedback_details);

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

        {/* quick glance */}
        <div className=" shadow-lg p-4 sm:p-7 bg-[#F5F6F6] mt-6">
          <h1 className="font-bold pb-3">Quick Glance</h1>
          <div className="flex items-center justify-center sm:justify-start flex-wrap gap-4">
            {/* opened */}
            <div className="shadow-lg w-[157px] h-[85px] rounded-[15px] bg-white flex flex-col gap-2 items-center justify-center">
              <p className="font-bold">{stat?.total_views}</p>
              <p className="text-sm">Opened</p>
            </div>

            {/* not opened */}
            <div className="shadow-lg w-[157px] h-[85px] rounded-[15px] bg-white flex flex-col gap-2 items-center justify-center">
              <p className="font-bold">{stat?.total_not_opened}</p>
              <p className="text-sm">Not opened</p>
            </div>

            {/* Clicked on review link */}
            <div className="shadow-lg min-w-[157px] h-[85px] rounded-[15px] bg-white flex flex-col gap-2 items-center justify-center">
              <p className="font-bold">{stat?.total_clicks}</p>
              <p className="text-sm">Clicked on review link</p>
            </div>

            {/* total review */}
            <div className="shadow-lg w-[157px] h-[85px] rounded-[15px] bg-white flex flex-col gap-2 items-center justify-center">
              <p className="font-bold">{stat?.total_reviews_submitted}</p>
              <p className="text-sm">Total review</p>
            </div>

            {/* total review sent */}
            <div className="shadow-lg w-[157px] h-[85px] rounded-[15px] bg-white flex flex-col gap-2 items-center justify-center">
              <p className="font-bold">{stat?.feedbacks?.total_feedbacks}</p>
              <p className="text-sm">Total review sent</p>
            </div>
          </div>
        </div>

        {/* table */}
        <StatsTable
          isLoading={loading}
          details={stat?.feedbacks?.feedback_details}
        />
      </div>
    </DashboardLayout>
  );
};

export default ViewStats;
