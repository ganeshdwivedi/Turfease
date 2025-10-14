import React, { useState } from "react";
import CourtFilter from "../features/court/CourtFilter";
import type { Court as CourtInter } from "../Types/Court";
import { useDispatch, useSelector } from "react-redux";
import { openModal, selectCourt } from "../redux/courtSlice";
import { Button, Select } from "antd";
import CreateCourtModale from "../features/court/CreateCourtModale";

const Court = () => {
  const [selectedSport, setSelectedSport] = useState<string>("AllSport");
  const [AllCourts, setAllCourts] = useState<CourtInter[]>([]);
  const dispatch = useDispatch();
  return (
    <div>
      <div className="bg-none h-14 p-5 flex items-center justify-end">
        <div className="flex flex-row gap-4 items-center justify-between">
          <Select
            aria-label="no"
            // label="Select Sport"
            placeholder="Select sport"
            className="w-32"
            value={selectedSport}
            onChange={(value) => setSelectedSport(value as string)}
          >
            {["AllSport", "cricket", "footbal", "basketball"].map((court) => (
              <Select.Option key={court}>{court}</Select.Option>
            ))}
          </Select>
          <Button
            type="primary"
            onClick={() => dispatch(openModal({ mode: "create" }))}
          >
            Add new court
          </Button>
        </div>
      </div>
      <CourtFilter
        AllCourts={AllCourts}
        setAllCourts={setAllCourts}
        selectedSport={selectedSport}
      />

      <CreateCourtModale />
    </div>
  );
};

export default Court;
