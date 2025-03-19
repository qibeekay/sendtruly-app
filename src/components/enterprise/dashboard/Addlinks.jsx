import React, { useEffect, useState } from "react";
import img1 from "../../../assets/sms.png";
import { useToast } from "@chakra-ui/react";
import { CreateLink, GetReviewLinks } from "../../../api/reviews";
import PaymentsLink from "./PaymentsLink";

const Addlinks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // formdata the api expects
  const [formData, setFormData] = useState({
    link_name: "Google", // Default to Google
    link: "",
    reaction_type: "emoji", // Default to emoji
    texts: "",
    link_type: "external", // Default to external
  });

  // handle inputs change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handles reaction type change
  const handleReactionChange = (reaction) => {
    setFormData((prev) => ({ ...prev, reaction_type: reaction }));
  };

  // hnadles when link_type is changed
  const handleLinkTypeChange = (link) => {
    setFormData((prev) => ({ ...prev, link_type: link }));
  };

  // function to call and create review link
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

    //console.log(result);

    setIsLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-4 mt-7">
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
            {/* Links type */}
            <div>
              <p>Link type</p>
              {/* type select */}
              <div className=" flex gap-2">
                {/* external select  */}
                <label className="flex items-center gap-2 font-medium text-lg cursor-pointer">
                  <input
                    type="radio"
                    name="link_type"
                    checked={formData.link_type === "external"}
                    onChange={() => handleLinkTypeChange("external")}
                  />
                  External
                </label>

                <label className="flex items-center gap-2 font-medium text-lg cursor-pointer">
                  <input
                    type="radio"
                    name="link_type"
                    checked={formData.link_type === "internal"}
                    onChange={() => handleLinkTypeChange("internal")}
                  />
                  Internal
                </label>
              </div>
            </div>

            {/* Conditional rendering for website and review link */}
            {formData.link_type === "external" && (
              <>
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
              </>
            )}

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

        {/* paymentLink */}
        <PaymentsLink />
      </div>
    </div>
  );
};

export default Addlinks;
