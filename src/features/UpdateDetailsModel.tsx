import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Tabs,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa6";
import { LoginME, UpdateAdminInfo } from "../api/User";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { updateAuthState } from "../redux/authSlice";
import toast from "react-hot-toast";

interface FormInput {
  name: string;
  email: string;
  phone_number: string;
  profile: string;
  tempProfile: string;
  isProfileSuccess: boolean;
  isLoading: boolean;
  generatedUrl: string;
}
const UpdateDetailsModel = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const authStateUser: any = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm<FormInput>();
  const [isshowProfile, setIsShowProfile] = useState<boolean>(false);
  const {
    name,
    email,
    phone_number,
    profile,
    tempProfile,
    isProfileSuccess,
    isLoading,
    generatedUrl,
  } = watch();

  useEffect(() => {
    reset(authStateUser);
  }, [authStateUser]);

  const appendFormData = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone_number", phone_number);
    tempProfile && formData.append("profile", tempProfile);

    return formData;
  };

  const OnSubmit = async () => {
    const apiData = appendFormData();
    try {
      const response = await UpdateAdminInfo(apiData);
      toast.success(response.data.message);
      dispatch(
        updateAuthState({
          isLoggedIn: true,
          user: response.data.data,
        })
      );
      handleClose();
    } catch (error: Error | any) {
      const errormssg = error.response.data.error;
      toast.error(errormssg);
    }
  };

  const GETUSER = async () => {
    try {
      const user = await LoginME();
      dispatch(
        updateAuthState({
          isLoggedIn: true,
          user,
        })
      );
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    clearErrors();
    reset();
  };

  const handleImageUploader = (e: any, type?: string) => {
    setValue("profile", URL.createObjectURL(e.target.files[0]));
    setValue("tempProfile", e.target.files[0]);
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>Personal Information</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(OnSubmit)}>
            <div className="flex flex-col gap-3">
              <div className="relative w-16">
                <img
                  className="rounded-full shadow-btn object-cover w-16 h-16"
                  src={profile ? profile : "/Images/Profile.svg"}
                  alt="admin-img"
                />

                <div className="rounded-full py-[3px] px-[2.5px] absolute bottom-0 right-0 bg-black text-white w-4 h-4">
                  <input
                    type="file"
                    className="w-4 h-4 absolute opacity-0"
                    onChange={(e) => handleImageUploader(e, "profile")}
                  />
                  <FaCamera className="text-[10px]" />
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 justify-between">
                <p>Name</p>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="border border-black border-opacity-30 h-10 rounded-md px-2"
                    {...register("name", {
                      required: true,
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "Please enter a valid Name",
                      },
                    })}
                  />
                  {errors.name ? (
                    <p className="text-red-700 font-light text-[12px]">
                      {errors.name?.message}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 justify-between">
                <p>Email</p>
                <div className="flex flex-col items-start">
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="border border-black border-opacity-30 h-10 rounded-md px-2"
                    {...register("email", {
                      required: true,
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />
                  {errors.email ? (
                    <p className="text-red-700 font-light text-[12px]">
                      {errors.email?.message}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 justify-between">
                <p>Phone Number</p>
                <div className="flex flex-col items-start">
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="border border-black border-opacity-30 h-10 rounded-md px-2"
                    {...register("phone_number", {
                      required: true,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Please enter a valid mobile number",
                      },
                    })}
                  />
                  {errors.phone_number ? (
                    <p className="text-red-700 font-light text-[12px]">
                      {errors.phone_number?.message}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div
              className={`flex flex-row my-1 items-center justify-between mt-6`}
            >
              <button
                onClick={handleClose}
                className="shadow-btn font-regular px-3 py-1 rounded-md"
              >
                {"cancel"}
              </button>
              <button
                type="submit"
                className="bg-sidebar text-white shadow-btn font-regular px-3 py-1 rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UpdateDetailsModel;
