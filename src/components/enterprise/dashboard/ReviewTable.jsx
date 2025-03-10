import React, { useEffect, useState } from "react";
import { GetReviews } from "../../../api/reviews";

const ReviewTable = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all sms delivery reports on mount
  useEffect(() => {
    const getReview = async () => {
      setIsLoading(true);
      const result = await GetReviews();
      console.log("review re", result);
      //   setRanges(result.data.date_ranges);
      setIsLoading(false);
    };
    getReview();
  }, []);
  return <div>ReviewTable</div>;
};

export default ReviewTable;
