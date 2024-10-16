import { Modal, ModalBody, ModalContent, ModalHeader, Switch, Tab, Tabs, cn } from "@nextui-org/react";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import Customer from "../../Types/Customer";
import useGetAllCustomerBookings from "../../customHook/useGetAllCustomerBookings";
import moment from "moment";
import { UpdateCustomer } from "../../api/User";

interface formInput {
  _id:string  
  name: string;
  phone_number: number;
  profile: string;
  email: string;
}

const CustomerModel = ({
  admin,
  isOpen,
  onOpenChange,
  update
}: {
  admin: Customer;
  isOpen: boolean;
  onOpenChange: any;
  update:any
}) => {
    const {isSuccess,isError,data,setCustomerId} = useGetAllCustomerBookings();
    // all bookings of selectedCustomer
    const [AllPastBookings,SetAllPastBookings] = useState<any[]>([]);
    const [AllFutureBookings,SetAllFutureBookings] = useState<any[]>([]);
    const { register, watch, control, setValue, handleSubmit, reset } =
    useForm<formInput>();
    const [selectedKey,setSelectedKey] = useState<string>('past');
  const { _id,name, email, phone_number, profile } = watch();

  useEffect(() => {
    if (!!admin) {
        setCustomerId(admin._id);
      reset(admin);
      return;
    }
    reset({
        profile:
        "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    });
  }, [admin]);
  
  useEffect(() => {

    if(isSuccess){
        const pastBook = data?.filter((item:any)=>moment(item.bookingDate).isBefore(new Date));
        const futureBook = data?.filter((item:any)=>moment(item.bookingDate).isAfter(new Date));

        SetAllPastBookings(pastBook);
        SetAllFutureBookings(futureBook)
    }

  }, [isSuccess,isError,data]);


  const OnSubmit = async (data:any)=>{
    try {
        const response = await update({customer_id:_id,updatedCustomer:data});        
        handleclose();
    } catch (error:any) {
        toast.error(error.error);
    }
  }
  


  const handleclose = () => {
    onOpenChange();
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={handleclose}>
       
      <ModalContent>
      <ModalHeader></ModalHeader>
        <ModalBody className="w-auto">
            <form onSubmit={handleSubmit(OnSubmit)}>
          <div className="flex flex-row items-center gap-3">
            <div className="relative">
            <img
              className="rounded-full object-cover w-16 h-16"
              src={profile}
              alt="admin-img"
            />
            <div className="rounded-full p-[3px] absolute bottom-0 right-0 bg-black text-white w-4 h-4">
            <FaCamera className="text-[10px]"/>
            </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Name"
                  className="border border-black border-opacity-30 h-10 rounded-md px-2"
                  {...register('name',{required:true})}
                />
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="border border-black border-opacity-30 h-10 rounded-md px-2"
                  {...register('email',{required:true})}
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  className="border border-black border-opacity-30 h-10 rounded-md px-2"
                  {...register('phone_number',{required:true})}
                />
                <button type="button" className="font-regular bg-[#06b6d4] text-white px-2 py-1 rounded-md shadow-btn w-full">Whatsapp</button>
              </div>
            </div>
          </div>
          <Tabs color="primary" 
        variant="underlined"
        classNames={{
          tabList: "gap-6 relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]"
        }} selectedKey={selectedKey} onSelectionChange={(e:string|any)=>setSelectedKey(e)}>
            <Tab key='past' title="Past Bookings">
                <div className="grid grid-cols-5 font-semibold">
                    <p>Date</p>
                    <p>Court Name</p>
                    <p>Sport</p>
                    <p>Amount</p>
                    <p>Location</p>
                </div>
                <div className="flex flex-col">
                 {
                   AllPastBookings?.length>0? AllPastBookings?.map((item:any)=> <div className="font-light grid grid-cols-5 text-sm">
                        <p className="flex flex-row items-center">{moment(item.bookingDate).format('DD/MM/yyyy')}</p> 
                        <p>{item.court.courtName}</p>
                        <p>{item.sport}</p>
                         <p>{item.payment.totalAmount}</p>
                         <p>{item.court.location.city}</p>
                         </div>):<p className="text-center font-light p-2">No Upcoming Bookings Found</p>
                 }
                   

                </div>
            </Tab>
            <Tab key='future' title="Upcoming Bookings">
            <div className="grid grid-cols-5 font-semibold">
                    <p>Date</p>
                    <p>Court Name</p>
                    <p>Sport</p>
                    <p>Amount</p>
                    <p>Location</p>
                </div>
                <div className="flex flex-col">
                 {
                   AllFutureBookings?.length>0 ? AllFutureBookings?.map((item:any)=> <div className="font-light grid grid-cols-5 text-sm">
                        <p className="flex flex-row items-center">{moment(item.bookingDate).format('DD/MM/yyyy')}</p> 
                        <p>{item.court.courtName}</p>
                        <p>{item.sport}</p>
                         <p>{item.payment.totalAmount}</p>
                         <p>{item.court.location.city}</p>
                         </div>):<p className="text-center font-light p-2">No Upcoming Bookings Found</p>
                 }
                   

                </div>
            </Tab>
          </Tabs>
          <div
            className={`flex flex-row my-1 items-center justify-between mt-6`}
          >
            <button
              onClick={handleclose}
              className="shadow-btn font-regular px-3 py-1 rounded-md"
            >
              {!!admin ? "Delete" : "Cancel"}
            </button>
            <button type="submit" className="bg-[#06b6d4] text-white shadow-btn font-regular px-3 py-1 rounded-md">
              Save
            </button>
          </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomerModel;
