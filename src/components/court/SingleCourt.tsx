import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { selectCourt } from "../../redux/courtSlice";
import { Court } from "../../Types/Court";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { IoLocationOutline } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineSportsVolleyball } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

declare global {
  interface Window {
    umami?: (event: string, data?: Record<string, any>) => void;
  }
}

const SingleCourt = ({ court }: { court: Court }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.umami) {
      window.umami("viewed-court", { courtId: court?._id });
    } else {
      console.warn("Umami not loaded yet");
    }
  }, [court]);

  return (
    <div
      key={court._id}
      onClick={() =>
        dispatch(
          selectCourt({
            court_id: court._id,
            courtAddress: court.address,
            courtName: court.courtName,
            courtProfile: "",
          })
        )
      }
      className="bg-white w-[350px] p-3 flex flex-col gap-2 rounded-[16px]"
    >
      <div className="w-full h-[180px]">
        <img
          className="w-full rounded-[24px] h-full object-cover"
          src={
            court.profile_img
              ? court.profile_img
              : "https://5.imimg.com/data5/SELLER/Default/2022/12/GT/XH/CW/2451824/cricket-turf.jpg"
          }
          alt="court-img"
        />
      </div>
      <div className="flex flex-col items-start gap-1">
        <p className="font-semibold text-lg">{court.courtName}</p>
        <p className="flex flex-row items-center text-gray-500 gap-2">
          <IoLocationOutline />
          {court.location?.city}, {court.location?.state}
        </p>
        <p className="flex flex-row items-center text-gray-500 gap-2">
          <MdOutlineSportsVolleyball />
          {court.sportsAvailable?.map((item: string) => item).join(", ")}
        </p>
        <div className="flex flex-row items-center justify-between gap-2 w-full">
          <p className="font-semibold text-xl">${court?.pricePerHour}/hr</p>
          <div className=" flex flex-row items-center gap-2">
            <Button
              icon={
                <Link target="_blank" to={court.address}>
                  <FaExternalLinkAlt />
                </Link>
              }
            />
            <Button icon={<FiEdit className="text-[17px]" />} />
            {/* <Button type="primary" className="font-regular text-sm"></Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCourt;
