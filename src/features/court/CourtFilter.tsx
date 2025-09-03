import React, { useEffect, useState } from "react";
import SingleCourt from "../../components/court/SingleCourt";
import { GetallCourt } from "../../api/Court";
import { Court } from "../../Types/Court";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useGetAllCourts from "../../customHook/useGetAllCourts";

const CourtFilter = ({
  selectedSport,
  AllCourts,
  setAllCourts,
}: {
  AllCourts: Court[];
  setAllCourts: (value: Court[]) => void;
  selectedSport: string;
}) => {
  const { isSuccess, isError, data } = useGetAllCourts();
  const [FilteredCourt, setFilteredCourt] = useState<Court[]>([]);

  useEffect(() => {
    if (isSuccess) {
      setAllCourts(data);
    }
  }, [isSuccess, isError, data]);

  useEffect(() => {
    if (selectedSport !== "AllSport" && selectedSport) {
      const filtered = AllCourts.filter((court) =>
        court.sportsAvailable.includes(selectedSport)
      );
      setFilteredCourt(filtered);
    } else {
      setFilteredCourt(AllCourts);
    }
  }, [AllCourts, selectedSport]);

  return (
    <div className="h-[100vh] relative p-3">
      <p className="font-semibold text-xl mb-2">All Courts</p>
      <div className="grid grdi-cols-4 gap-4 overflow-x-hidden ">
        {FilteredCourt?.length > 0 ? (
          FilteredCourt.map((court) => (
            <SingleCourt key={court?._id} court={court} />
          ))
        ) : (
          <p className="md:w-[330px]">No Court Founds</p>
        )}
      </div>
    </div>
  );
};

export default CourtFilter;
