import React from "react";
import img from "../../../assets/group.png";
import img1 from "../../../assets/sms.png";
import img2 from "../../../assets/coming.png";
import img3 from "../../../assets/coming1.png";
import img4 from "../../../assets/soon.png";
import { Link } from "react-router-dom";

const Marketing = () => {
  return (
    <div className="w-full font-poppins mt-5">
      {/* first column */}
      <div className="w-full">
        <div className="flex w-full bg-[#FFBA00] rounded-[20px] items-center justify-between p-[27px]">
          {/* text */}
          <div className="w-[462px] md:w-[600px]">
            <h1 className="font-bold text-[24px]">
              Be the marketer you can be
            </h1>
            <p className="text-[20px] mt-7">
              Turn one-time shoppers into customers for life and maximize
              customer value with SMS, Reviews, and Text2Pay.
            </p>
          </div>
          {/* image */}
          <div>
            <div>
              <img src={img} alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* second column */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 items-center gap-4 mt-7">
        {/* sms-t2p-review */}
        <div className=" min-h-[238px] shadow-md flex flex-col justify-between rounded-[20px] px-4 py-7 bg-[#E2FFDF]">
          {/* first section */}
          <div className="flex justify-between">
            {/* image */}
            <div>
              <div>
                <img src={img1} alt="" />
              </div>
            </div>
            {/* button */}
            <div>
              <Link
                to={"dashboard/enterprise/dashboard"}
                className="shadow bg-white rounded-[10px] px-5 py-1"
              >
                Get Started
              </Link>
            </div>
          </div>
          {/* second section */}
          <div>
            <h1 className="font-bold text-[20px]">
              Send SMS, T2P & reviews out via SMS
            </h1>
            <p className="text-[14px]">
              Create personalized customer experiences via SMS with real-time
              data and AI-driven insights.
            </p>
          </div>
        </div>

        {/* email */}
        <div className=" min-h-[238px] shadow-md flex flex-col justify-between rounded-[20px] px-4 py-7 bg-[#FFEFBC]">
          {/* first section */}
          <div className="flex justify-between">
            {/* image */}
            <div>
              <div>
                <img src={img2} alt="" />
              </div>
            </div>
            {/* button */}
            <div>
              <div>
                <img src={img4} alt="" />
              </div>
            </div>
          </div>
          {/* second section */}
          <div>
            <h1 className="font-bold text-[20px]">Communicate via Email</h1>
            <p className="text-[14px]">
              Create eye-catching emails and drive revenue with an intuitive
              email platform that cuts out the extra costs.
            </p>
          </div>
        </div>

        {/* whatsapp */}
        <div className=" min-h-[238px] shadow-md flex flex-col justify-between rounded-[20px] px-4 py-7 bg-[#F4F136]">
          {/* first section */}
          <div className="flex justify-between">
            {/* image */}
            <div>
              <div>
                <img src={img3} alt="" />
              </div>
            </div>
            {/* button */}
            <div>
              <div>
                <img src={img4} alt="" />
              </div>
            </div>
          </div>
          {/* second section */}
          <div>
            <h1 className="font-bold text-[20px] text-black/25">
              Try whatsapp marketing
            </h1>
            <p className="text-[14px] text-black/25">
              Emails for reviews are a win-win: customers feel heard, and your
              business grows with authentic feedback. Try it now and build
              stronger connections!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
