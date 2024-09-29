import { Modal, ModalBody, ModalContent, Switch, cn } from "@nextui-org/react";
import React, { useEffect } from "react";
import { userType } from "./SettingTable";
import { useForm } from "react-hook-form";

interface formInput {
  name: string;
  number: number;
  avatar: string;
  email: string;
  status: string;
  active: boolean;
}

const AdminViewModal = ({
  admin,
  isOpen,
  onOpenChange,
}: {
  admin: userType;
  isOpen: boolean;
  onOpenChange: any;
}) => {
  const { register, watch, control, setValue, handleSubmit, reset } =
    useForm<formInput>();
  const { name, email, number, avatar, status, active } = watch();

  useEffect(() => {
    if (!!admin) {
      const active = admin.status === "active" ? true : false;
      const updateData = { ...admin, active: active };
      reset(updateData);
      return;
    }
    reset({
      avatar:
        "https://tse2.mm.bing.net/th?id=OIP.hyOp4DHwU808lVPQ7qaZJAHaHa&pid=Api&P=0&h=180",
    });
  }, [admin]);

  const handleclose = () => {
    onOpenChange();
  };

  return (
    <Modal size="xl" isOpen={isOpen} onOpenChange={handleclose}>
      <ModalContent>
        <ModalBody className="w-auto">
          <div className="flex flex-row items-center gap-3">
            <img
              className="rounded-full w-16 h-16"
              src={avatar}
              alt="admin-img"
            />
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Name"
                  className="border border-black border-opacity-30 rounded-md px-2"
                  onChange={(e: any) => console.log(e.target.value)}
                  value={name}
                />
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="border border-black border-opacity-30 rounded-md px-2"
                  onChange={(e: any) => console.log(e.target.value)}
                  value={email}
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  className="border border-black border-opacity-30 rounded-md px-2"
                  onChange={(e: any) => console.log(e.target.value)}
                  value={"123412412"}
                />
                <div className="flex flex-row justify-between items-center w-full">
                  <p className="font-regular tex-sm capitalize ml-3 ">
                    {status}
                  </p>
                  <Switch
                    classNames={{
                      wrapper: "p-0 h-5 overflow-visible",
                      thumb: cn(
                        "w-[14px] h-[14px] border-2 shadow-lg",
                        "group-data-[hover=true]:border-primary",
                        "group-data-[selected=true]:ml-6",
                        "group-data-[pressed=true]:w-4",
                        "group-data-[selected]:group-data-[pressed]:ml-4"
                      ),
                    }}
                    size="sm"
                    onChange={() => setValue("active", !active)}
                    isSelected={active}
                    color="primary"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-row my-1 items-center justify-between mt-6`}
          >
            <button
              onClick={() => onOpenChange(false)}
              className="shadow-btn font-regular px-3 py-1 rounded-md"
            >
              {!!admin ? "Delete" : "Cancel"}
            </button>
            <button className="bg-primary text-white shadow-btn font-regular px-3 py-1 rounded-md">
              Save
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AdminViewModal;
