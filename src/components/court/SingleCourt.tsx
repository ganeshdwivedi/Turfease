import React from "react";
import { useDispatch } from "react-redux";
import { selectCourt } from "../../redux/courtSlice";
import type { Court } from "../../Types/Court";
import { Link } from "react-router-dom";
import { Button, Card } from "antd";
import { IoLocationOutline } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineSportsVolleyball } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
const SingleCourt = ({ court }: { court: Court }) => {
  const dispatch = useDispatch();

  return (
    <Card
      key={court._id}
      className="bg-white hover:shadow-xl w-[350px] !p-0 shadow-md flex flex-col gap-2 rounded-[16px]"
    >
      <div className="w-full h-[180px]">
        <img
          className="w-full rounded-md h-full object-cover"
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
              onClick={() =>
                dispatch(
                  selectCourt({
                    court,
                    mode: "view",
                  })
                )
              }
              icon={
                <Link target="_blank" to={court.address}>
                  <FaExternalLinkAlt />
                </Link>
              }
            />
            <Button
              onClick={() =>
                dispatch(
                  selectCourt({
                    court,
                    mode: "update",
                  })
                )
              }
              icon={<FiEdit className="text-[17px]" />}
            />
            {/* <Button type="primary" className="font-regular text-sm"></Button> */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SingleCourt;
