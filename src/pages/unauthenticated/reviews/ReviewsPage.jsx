import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import PageLoader from "../../../components/loaders/PageLoader";
import { MakeReview, ReviewRedirect } from "../../../api/reviews";
import { FaRegStar, FaStar } from "react-icons/fa6";
import emoji1 from "../../../assets/emoji1.png";
import emoji2 from "../../../assets/emoji2.png";
import emoji3 from "../../../assets/emoji3.png";
import emoji4 from "../../../assets/emoji4.png";
import emoji5 from "../../../assets/emoji5.png";
import { useToast } from "@chakra-ui/react";

const emojiOptions = [emoji1, emoji2, emoji3, emoji4, emoji5]; // Emoji rating options
const starOptions = [1, 2, 3, 4, 5]; // Star rating options

const ReviewsPage = () => {
  const { reviewId } = useParams(); // Extract reviewId from the route
  const [searchParams] = useSearchParams();
  const number = searchParams.get("t");
  const [review, setReview] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State to control success modal
  const navigate = useNavigate(); // Hook to navigate to homepage

  const [selectedEmoji, setSelectedEmoji] = useState(null); // Track selected emoji
  const [hoveredEmoji, setHoveredEmoji] = useState(null); // Track hovered emoji
  const [selectedStars, setSelectedStars] = useState(0);

  const toast = useToast();

  const [formData, setFormData] = useState({
    token: reviewId,
    number: number,
    name: null,
    review_ratings: "", // either emoji or text, value ranges from 1 - 5
    state_country: "",
    comment: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle emoji selection
  const handleEmojiClick = (emoji, index) => {
    setSelectedEmoji(emoji);
    setFormData((prev) => ({ ...prev, review_ratings: index + 1 })); // Update formData with rating
  };

  // Handle emoji hover
  const handleEmojiHover = (emoji) => {
    setHoveredEmoji(emoji);
  };

  // Handle emoji leave
  const handleEmojiLeave = () => {
    setHoveredEmoji(null);
  };

  // Handle star selection
  const handleStarClick = (star) => {
    setSelectedStars(star);
    setFormData((prev) => ({ ...prev, review_ratings: star })); // Update formData with rating
  };

  // Fetch review data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await ReviewRedirect(reviewId, number);
      setReview(result.data);
      setLoading(false);
    };
    fetchData();
  }, [reviewId, number]);

  console.log(formData);

  // Function to submit review
  const SubmitReview = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await MakeReview({
      ...formData,
      state_country: review?.state_country,
    });

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    setIsLoading(false);

    // Show success modal if review submission is successful
    if (result.success) {
      setShowSuccessModal(true);
    }
  };

  // Function to close modal and redirect to homepage
  const handleReturnToHomepage = () => {
    setShowSuccessModal(false);
    navigate("/"); // Navigate to homepage
  };

  return (
    <div>
      <PageLoader isLoading={loading} />
      <div className="max-w-[500px] bg-[#E1EDFF] min-h-screen mx-auto p-4 w-full flex items-center justify-center">
        <form className="w-full flex flex-col gap-7 ">
          {/* emoji / star review */}
          <div>
            <p>{review?.review_info?.texts}</p>
            <div className=" bg-white mt-2 rounded-[15px]">
              {review?.review_info?.reaction_type === "emoji" ? (
                // Render emoji options
                <div className="h-[82px] flex items-center justify-center gap-3 w-full">
                  {emojiOptions?.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`text-2xl transition-transform duration-200 ${
                        selectedEmoji === emoji || hoveredEmoji === emoji
                          ? "scale-125" // Increase size on hover or selection
                          : "scale-100"
                      }`}
                      onClick={() => handleEmojiClick(emoji, index)}
                      onMouseEnter={() => handleEmojiHover(emoji)}
                      onMouseLeave={handleEmojiLeave}
                    >
                      <img src={emoji} alt="" />
                    </button>
                  ))}
                </div>
              ) : (
                // Render star options
                <div className="h-[82px] flex items-center justify-center gap-3 w-full">
                  {starOptions?.map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="text-yellow-500 text-3xl"
                      onClick={() => handleStarClick(star)}
                    >
                      {star <= selectedStars ? (
                        <FaStar /> // Filled star
                      ) : (
                        <FaRegStar /> // Outlined star
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* textarea */}
          <div>
            <p>Share details of your own experience</p>
            <div>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                className="bg-white w-full mt-2 rounded-[15px] h-[186px] p-4"
              ></textarea>
            </div>
          </div>

          {/* submit button */}
          <div className="flex w-full items-center justify-center">
            <button
              onClick={SubmitReview}
              className="font-bold py-2 px-8 bg-white w-fit rounded-[15px]"
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-[15px] max-w-[400px] w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
            <p className="mb-6">Your review has been submitted successfully.</p>
            <button
              onClick={handleReturnToHomepage}
              className="bg-blue-500 text-white font-bold py-2 px-8 rounded-[15px]"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
