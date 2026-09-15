import React, { useEffect, useState } from "react";
import SingleCourt from "../../components/court/SingleCourt";
import type { Court } from "../../Types/Court";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import useGetAllCourts from "../../hooks/useGetAllCourts";

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
      <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-4 lg:grid-cols-3 gap-6 overflow-x-hidden ">
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
