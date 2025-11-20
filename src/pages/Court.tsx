import { Button, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import CourtFilter from "../features/court/CourtFilter";
import SingleCourtData from "../features/court/SingleCourtData";
import { Court as CourtInter } from "../Types/Court";
import { useDispatch, useSelector } from "react-redux";
import { openModal, selectCourt } from "../redux/courtSlice";

const Court = () => {
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [AllCourts, setAllCourts] = useState<CourtInter[]>([]);
  const dispatch = useDispatch();
  return (
    <div>
      <div className="bg-[#508267] h-14 p-5 flex flex-row items-center justify-between">
        <h3 className="font-semibold text-2xl text-white">Court Settings</h3>
        <div className="flex flex-row gap-4 items-center justify-between">
          <Select
            aria-label="no"
            // label="Select Sport"
            placeholder="Select sport"
            selectionMode="single"
            className="w-32"
            value={selectedSport}
            onSelectionChange={(data) =>
              setSelectedSport(data.currentKey as string)
            }
          >
            {["AllSport", "cricket", "footbal", "basketball"].map((court) => (
              <SelectItem key={court}>{court}</SelectItem>
            ))}
          </Select>
          <Button onClick={() => dispatch(openModal())}>Add new court</Button>
        </div>
      </div>
      <CourtFilter
        AllCourts={AllCourts}
        setAllCourts={setAllCourts}
        selectedSport={selectedSport}
      />
      {/* <div className="bg-no-repeat grid h-[100vh] place-items-center bg-cover CourtBGGG w-[60%] ">
        
      </div> */}

      <SingleCourtData setAllCourts={setAllCourts} />
    </div>
  );
};

export default Court;
