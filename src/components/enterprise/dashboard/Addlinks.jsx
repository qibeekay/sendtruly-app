import React, { useEffect, useState } from "react";
import img1 from "../../../assets/sms.png";
import { useToast } from "@chakra-ui/react";
import { CreateLink, GetReviewLinks } from "../../../api/reviews";

const Addlinks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    link_name: "Google", // Default to Google
    link: "",
    reaction_type: "emoji", // Default to emoji
    texts: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReactionChange = (reaction) => {
    setFormData((prev) => ({ ...prev, reaction_type: reaction }));
  };

  const createReviewLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await CreateLink(formData);

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    console.log(result);

    setIsLoading(false);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mt-7">
        {/* review link */}
        <div className="w-full min-h-[238px] shadow-md rounded-[20px] px-10 py-7 bg-[#B498F973]">
          {/* text */}
          <div className="">
            <h1>Ask For Online Reviews</h1>
            <p>Where do you want to increase your online reputation?</p>
          </div>

          {/* form */}
          <form
            action=""
            className="flex flex-col gap-4 mt-5"
            onSubmit={createReviewLink}
          >
            {/* website */}
            <div>
              <label htmlFor="">Choose a website</label>
              <div>
                <select
                  name="link_name"
                  className="w-full h-[45px] rounded-[10px] border border-black/25 px-7 outline-none"
                  value={formData.link_name}
                  onChange={handleInputChange}
                >
                  <option value="Google">Google</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* review link */}
            <div>
              <input
                type="text"
                className="w-full h-[45px] rounded-[10px] border border-black/25 px-7 outline-none"
                placeholder="Enter your review link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
              />
            </div>

            {/* reaction type */}
            <div>
              <p>Reaction type</p>
              {/* gender select */}
              <div className=" flex gap-2">
                {/* male select  */}
                <label className="flex items-center gap-2 font-medium text-lg cursor-pointer">
                  <input
                    type="radio"
                    name="reaction_type"
                    checked={formData.reaction_type === "emoji"}
                    onChange={() => handleReactionChange("emoji")}
                  />
                  Emoji
                </label>

                <label className="flex items-center gap-2 font-medium text-lg cursor-pointer">
                  <input
                    type="radio"
                    name="reaction_type"
                    checked={formData.reaction_type === "text"}
                    onChange={() => handleReactionChange("text")}
                  />
                  Text
                </label>
              </div>
            </div>

            {/* text */}
            <div>
              <input
                type="text"
                className="w-full h-[45px] rounded-[10px] border border-black/25 px-7 outline-none"
                placeholder="Enter message"
                name="texts"
                value={formData.texts}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <button
                className={`border border-pinks rounded-[10px] text-white px-6 py-4 bg-pinks hover:bg-pinks/80 duration-300 ease-in-out `}
              >
                {isLoading ? "Loading..." : "Create link"}
              </button>
            </div>
          </form>
        </div>

        {/* payment link */}
        <div className="w-full min-h-[238px] shadow-md rounded-[20px] px-4 py-7 bg-[#FF1D9C57]">
          {/* text */}
          <div className="">
            <h1>Ask For Online Reviews</h1>
            <p>Where do you want to increase your online reputation?</p>
          </div>

          {/* form */}
          <form action="" className="flex flex-col gap-4 mt-5">
            {/* website */}
            <div>
              <label htmlFor="">Choose a website</label>
              <div>
                <select
                  name=""
                  id=""
                  className="w-full h-[45px] rounded-[10px] border border-black/25 px-7 outline-none"
                >
                  <option value="">Google</option>
                  <option value="">Facebook</option>
                </select>
              </div>
            </div>

            {/* review link */}
            <div>
              <input
                type="text"
                className="w-full h-[45px] rounded-[10px] border border-black/25 px-7 outline-none"
                placeholder="Enter your review link"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addlinks;
