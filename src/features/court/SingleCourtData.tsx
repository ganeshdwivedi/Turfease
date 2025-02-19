import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa6";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { WorkingHour } from "../../components/settings/Constant";
import moment from "moment";
import AllLocation from "../../Types/locationData.json";
import { IoCloudUploadOutline } from "react-icons/io5";
import {
  CreateCourt,
  DeleteCourt,
  GetCourt,
  UpdateCourt,
} from "../../api/Court";
import { sports } from "../../Types/Sports";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import { useGetCourtByID } from "../../customHook/useGetAllCourts";
import { Court as CourtInter } from "../../Types/Court";

interface Court {
  _id?: string;
  courtName: string;
  contactNumber: string;
  address: string;
  location: { state: string; city: string };
  ownedBy: string;
  pricePerHour: string;
  sportsAvailable: string[];
  workingHours: { start: string; end: string };
  profile_img: string;
  profile_url: string;
  other_img: string[];
  other_url: string[];
}

interface ChildComponentProps {
  setAllCourts: React.Dispatch<React.SetStateAction<CourtInter[]>>;
}

const SingleCourtData: React.FC<ChildComponentProps> = ({ setAllCourts }) => {
  const { isSuccess, isError, data, setCourtID } = useGetCourtByID();
  const selectedCourt = useSelector((state: RootState) => state.court);
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<Court>({
    defaultValues: {
      courtName: "",
      contactNumber: "",
      address: "",
      location: { state: "", city: "" },
      workingHours: { start: "", end: "" },
      pricePerHour: "",
      sportsAvailable: [],
      profile_img: "",
      other_img: [],
    },
  });
  const {
    courtName,
    contactNumber,
    address,
    location,
    pricePerHour,
    sportsAvailable,
    other_img,
    profile_img,
    profile_url,
    workingHours,
    _id: court_id,
    other_url,
  } = watch();

  useEffect(() => {
    if (selectedCourt.court_id) {
      setCourtID(selectedCourt.court_id);
    }
  }, [selectedCourt]);

  useEffect(() => {
    if (isSuccess) {
      reset(data);
    } else {
      reset();
    }
  }, [isSuccess, isError, data]);

  const handleUpdateCourt = async (court_id: string) => {
    const apidata = AppendFormdata();
    try {
      const response = await UpdateCourt(court_id, apidata);
      reset(response.data);
      toast.success(response.message);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleDelete = async () => {
    if (court_id) {
      try {
        const { message, data } = await DeleteCourt(court_id);
        toast.success(message);
        setAllCourts((prev: CourtInter[]) => {
          return prev.filter((item: CourtInter) => item._id !== data._id);
        });
        reset();
      } catch (error) {
        console.log(error, "error court");
      }
    } else {
      reset();
    }
  };

  const AppendFormdata = () => {
    const formData = new FormData();

    formData.append("courtName", courtName);
    formData.append("contactNumber", contactNumber);
    formData.append("address", address);
    formData.append("location", JSON.stringify(location));
    formData.append("pricePerHour", pricePerHour);
    formData.append("workingHours", JSON.stringify(workingHours));
    profile_url && formData.append("profile_img", profile_url);
    other_url?.length > 0 &&
      other_url.map((item: any, index: number) => {
        formData.append(`other_img`, item);
      });
    formData.append(`sportsAvailable`, JSON.stringify(sportsAvailable));

    return formData;
  };

  const handleCreateCourt = async () => {
    const apidata = AppendFormdata();
    try {
      const response = await CreateCourt(apidata);
      const courtData: CourtInter = response.data;
      setAllCourts((value: CourtInter[]) => [...value, courtData]);
      // reset(response.data);
      toast.success(response.message);
    } catch (error) {
      console.log(error, "eroor");
    }
  };

  const OnSubmit = async () => {
    if (court_id) {
      handleUpdateCourt(court_id);
    } else {
      handleCreateCourt();
    }
  };

  const handleImageUploader = (e: any, type?: string) => {
    if (type === "profile") {
      setValue("profile_img", URL.createObjectURL(e.target.files[0]));
      setValue("profile_url", e.target.files[0]);
    } else if (type === "other") {
      Object.values(e.target.files)?.map((item: any, index: number) => {
        setValue(`other_url.${index}`, item);
        setValue(`other_img.${index}`, URL.createObjectURL(item));
      });
    }
  };
  const profile = false;
  return (
    <div className="bg-white max-h-[95vh] overflow-y-scroll rounded-md m-5 w-[80%]">
      <form className="p-3" onSubmit={handleSubmit(OnSubmit)}>
        <div className="flex flex-col gap-3">
          <div className="relative w-16">
            <img
              className="rounded-md shadow-btn object-cover w-16 h-16"
              src={profile_img ? profile_img : "/Images/court.jpg"}
              alt="admin-img"
            />

            <div
              //   onClick={() => setIsShowProfile(true)}
              className="rounded-full py-[3px] px-[3px] absolute bottom-0 right-0 bg-black text-white w-4 h-4"
            >
              <input
                type="file"
                className="w-4 h-4 absolute opacity-0"
                onChange={(e) => handleImageUploader(e, "profile")}
              />
              <FaCamera className="text-[10px]" />
            </div>
          </div>
          <div>
            <p className="text-start">Working Hours</p>
            <div className="flex flex-row mt-1 justify-between items-center">
              <Select
                {...register("workingHours.start", {
                  required: "Please Select Start time",
                })}
                selectedKeys={[workingHours?.start]}
                labelPlacement="outside-left"
                label="Start Time"
                placeholder="Select Start time"
                selectionMode="single"
                classNames={{
                  trigger: "min-h-8 h-8",
                  base: "w-1/2 items-center",
                  label: "w-full",
                }}
              >
                {WorkingHour.map((court) => (
                  <SelectItem key={court}>
                    {moment(court, "HH:mm").format("HH:mm a")}
                  </SelectItem>
                ))}
              </Select>
              <Select
                {...register("workingHours.end", {
                  required: "Please Select end time",
                })}
                selectedKeys={[workingHours?.end]}
                labelPlacement="outside-left"
                label="End Time"
                placeholder="Select end time"
                selectionMode="single"
                classNames={{
                  trigger: "min-h-8 h-8",
                  base: "w-1/2 items-center",
                  label: "w-full",
                }}
              >
                {WorkingHour.map((court) => (
                  <SelectItem key={court}>
                    {moment(court, "HH:mm").format("HH:mm a")}
                  </SelectItem>
                ))}
              </Select>
              {errors.workingHours?.end?.message ? (
                <p className="text-red-700 font-light text-[12px]">
                  {errors.workingHours.end?.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 justify-between">
            <p>Court Name</p>
            <div className="flex flex-col items-start">
              <input
                type="text"
                placeholder="Enter Name"
                className="border border-black border-opacity-30 h-8 rounded-md px-2"
                {...register("courtName", {
                  required: true,
                  pattern: {
                    value: /^[a-zA-Z0-9\s]+$/,
                    message: "Please enter a valid Name",
                  },
                })}
              />
              {errors.courtName ? (
                <p className="text-red-700 font-light text-[12px]">
                  {errors.courtName?.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 justify-between">
            <p>Price Per Hour</p>
            <div className="flex flex-col items-start">
              <input
                type="number"
                placeholder="Enter Price"
                className="border border-black border-opacity-30 h-8 rounded-md px-2"
                {...register("pricePerHour", {
                  required: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter a valid price",
                  },
                })}
              />
              {errors.pricePerHour ? (
                <p className="text-red-700 font-light text-[12px]">
                  {errors.pricePerHour?.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 justify-between">
            <p>Contact Number [for customer]</p>
            <div className="flex flex-col items-start">
              <input
                placeholder="Enter phone number"
                className="border border-black border-opacity-30 h-8 rounded-md px-2"
                {...register("contactNumber", {
                  required: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter a valid mobile number",
                  },
                })}
              />
              {errors.contactNumber ? (
                <p className="text-red-700 font-light text-[12px]">
                  {errors.contactNumber?.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <p className="text-start">Sports Available</p>
            <div className="flex flex-row mt-3 justify-between items-center">
              <Select
                selectedKeys={sportsAvailable}
                onSelectionChange={(selected: any) =>
                  setValue("sportsAvailable", Array.from(selected))
                }
                label="Select sport:"
                labelPlacement="outside-left"
                placeholder="Select Sport"
                selectionMode="multiple"
                classNames={{
                  trigger: "min-h-8 h-8",
                  base: "w-full items-center",
                  label: "w-full",
                }}
              >
                {sports.map((court) => (
                  <SelectItem key={court} value={court}>
                    {court}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <p className="text-start">Court Location</p>
            <div className="flex flex-row mt-3 justify-between items-center">
              <Autocomplete
                selectedKey={location.state}
                label="Select State :"
                labelPlacement="outside-left"
                placeholder="Select State"
                classNames={{
                  base: "w-1/2 items-center",
                }}
              >
                {Object.keys(AllLocation).map((court) => (
                  <AutocompleteItem
                    onClick={() => setValue("location.state", court)}
                    key={court}
                    value={court}
                  >
                    {court}
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              {location.state !== "" ? (
                <Autocomplete
                  label="Select city :"
                  labelPlacement="outside-left"
                  placeholder="Select City"
                  selectedKey={location.city}
                  classNames={{
                    base: "w-1/2 items-center",
                  }}
                >
                  {Object.values(
                    AllLocation[location?.state as keyof typeof AllLocation]
                  ).map((court: any) => (
                    <AutocompleteItem
                      onClick={() => setValue("location.city", court)}
                      key={court}
                      value={court}
                    >
                      {court}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              ) : (
                ""
              )}
              {errors.location ? (
                <p className="text-red-700 font-light text-[12px]">
                  {errors.location?.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="flex flex-row items-center gap-2 justify-between">
            <p>Address Url [ Google maps ]</p>
            <div className="flex flex-col items-start">
              <input
                placeholder="Enter Adress"
                className="border border-black border-opacity-30 h-8 rounded-md px-2"
                {...register("address", {
                  required: "Url is required",
                  pattern: {
                    value: /^(https?:\/\/)?(www\.)?google\.com\/maps\/[^\s]*$/i,
                    message: "Please enter a valid Google Maps URL",
                  },
                })}
              />
              {errors.address ? (
                <p className="text-red-700 font-light text-[12px]">
                  {errors.address?.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <p className="font-medium text-left mt-3">Other Courts Images</p>
        <div className="flex flex-row items-center gap-2">
          {watch()?.other_img?.map((item: any) => (
            <img className="w-20 h-20 object-cover rounded-md" src={item} />
          ))}
        </div>
        <div className="bg-[#a6dbbf] w-full flex flex-col items-center justify-center h-64 mt-2 rounded-md relative overflow-hidden">
          <input
            className="absolute w-[100%] h-[250px] opacity-0"
            type="file"
            multiple
            onChange={(e) => handleImageUploader(e, "other")}
          />
          <IoCloudUploadOutline className="text-4xl" />
          <h3>Drag and drop files here</h3>
          <p>or</p>
          <p>Browse files</p>
        </div>
        <div className={`flex flex-row my-1 items-center justify-between mt-6`}>
          <button
            type="reset"
            onClick={handleDelete}
            className="shadow-btn font-regular px-3 py-1 rounded-md"
          >
            {court_id ? "delete" : "cancel"}
          </button>
          <button
            type="submit"
            className="bg-[#06b6d4] text-white shadow-btn font-regular px-3 py-1 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SingleCourtData;
