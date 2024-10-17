import { Modal, ModalBody, ModalContent, ModalHeader, Spinner, Tabs } from '@nextui-org/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaCamera } from 'react-icons/fa6';
import { UpdateSelfDetails } from '../api/User';


interface FormInput{
    name:string;
    email:string;
    phone_number:number;
    profile:string;
    tempProfile:string;
    isProfileSuccess:boolean;
    isLoading:boolean;
    generatedUrl:string;

}
const UpdateDetailsModel = ({isOpen,setIsOpen}:{isOpen:boolean,setIsOpen:(value: boolean) => void}) => {
    const {register,setValue,watch,handleSubmit} = useForm<FormInput>();
    const [isshowProfile,setIsShowProfile] = useState<boolean>(false);
    const {profile,tempProfile,isProfileSuccess,isLoading,generatedUrl}= watch();

    const OnSubmit = async ()=>{

    }

    
  const uploadProf = async(data:any)=>{
    try {
      const response  = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,data);
      setValue('generatedUrl',response.data.secure_url)
      setValue('isLoading',false);
      setValue('isProfileSuccess',true)
    } catch (error) {
      console.log(error)
    }
  }


    const handleChange = async(e:any)=>{
        setValue('isProfileSuccess',false);
        const formdata = new FormData();
        formdata.append('file',e.target.files[0])
        formdata.append('upload_preset','Turfease');
        setValue('tempProfile',URL.createObjectURL(e.target.files[0]));
        uploadProf(formdata)
        setValue('isLoading',true);
    }

    const handleUploadSave = async ()=>{
        try {
            const response = await UpdateSelfDetails({profile:profile});

        } catch (error) {
            console.log(error,'error');
        }
    }


  return (
    <Modal size='2xl' isOpen={isOpen} onClose={()=>setIsOpen(false)}>
    <ModalContent>
      <ModalBody>
      <form onSubmit={handleSubmit(OnSubmit)}>
          <div className="flex flex-row items-center gap-3">
            <div className="relative">
            <img
              className="rounded-full object-cover w-16 h-16"
              src={profile}
              alt="admin-img"
            />
          
            <div onClick={()=>setIsShowProfile(true)} className="rounded-full py-[3px] px-[3.5px] absolute bottom-0 right-0 bg-black text-white w-4 h-4">
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
     
          <div
            className={`flex flex-row my-1 items-center justify-between mt-6`}
          >
            <button
              onClick={()=>setIsOpen(false)}
              className="shadow-btn font-regular px-3 py-1 rounded-md"
            >
              {"cancel"}
            </button>
            <button type="submit" className="bg-[#06b6d4] text-white shadow-btn font-regular px-3 py-1 rounded-md">
              Save
            </button>
          </div>
          </form>
          <Modal size="xs" isOpen={isshowProfile} onClose={()=>setIsShowProfile(false)}>
            <ModalContent>
              <ModalHeader>
                <p className="font-regular">Upload Profile</p>
              </ModalHeader>
              <ModalBody>
                
              <div className="relative w-24 ml-20">
            <img
              className="rounded-full object-cover w-24 h-24"
              src={tempProfile}
              alt="admin-img"
            />
          
            <div onClick={()=>setIsShowProfile(true)} className="rounded-full py-[3px] px-[3.5px] absolute bottom-1 right-1 bg-black text-white w-4 h-4">
            <FaCamera className="text-[10px]"/>
            <div className="relative" >
            <input className="w-5 h-5 absolute top-[-9px] opacity-0 right-0" type="file" onChange={handleChange} />
            </div>
            </div>
            </div>
            {
              isLoading ? <Spinner />:''
            }

            <button onClick={handleUploadSave} className={`text-white w-16 rounded-md ${isProfileSuccess ? 'bg-[#06b6d4]' :'pointer-events-none cursor-not-allowed bg-red-400'}`}>Save</button>
              </ModalBody>
            </ModalContent>
          </Modal>
      </ModalBody>
    </ModalContent>
  </Modal>
  )
}

export default UpdateDetailsModel