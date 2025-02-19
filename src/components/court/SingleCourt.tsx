import React from "react";
import { useDispatch } from "react-redux";
import { selectCourt } from "../../redux/courtSlice";
import { Court } from "../../Types/Court";

const SingleCourt = ({ court }: { court: Court }) => {
  const dispatch = useDispatch();

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
      className="bg-white md:w-[330px] p-3 flex flex-col items-center rounded-[16px]"
    >
      <div className="w-[300px] h-[200px]">
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
      <p className="font-semibold text-lg">{court.courtName}</p>
      <p className="font-regular text-sm">{court.address}</p>
    </div>
  );
};

export default SingleCourt;
