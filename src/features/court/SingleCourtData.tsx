import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AllLocation from "../../Types/locationData.json";
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
import { Court as CourtInter, ICourt } from "../../Types/Court";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import { useQueryClient } from "react-query";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";

interface ChildComponentProps {
  setAllCourts: React.Dispatch<React.SetStateAction<CourtInter[]>>;
}

const SingleCourtData: React.FC<ChildComponentProps> = () => {
  const [isProfileUploading, setisProfileUploading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { isSuccess, isError, data, setCourtID } = useGetCourtByID();
  const { isOpen, ...selectedCourt } = useSelector(
    (state: RootState) => state.court
  );
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<ICourt>({
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
        queryClient.invalidateQueries({ queryKey: ["GetAllCourts"] });
        reset();
      } catch (error) {
        console.log(error, "error court");
      }
    } else {
      reset();
    }
  };

  const handleChange = (e: any) => {
    const formdata = new FormData();
    formdata.append("file", e.target.files[0]);
    formdata.append("upload_preset", "Turfease");
    setValue("profile_img", URL.createObjectURL(e.target.files[0]));
    setisProfileUploading(true);
    uploadProf(formdata);
  };

  //uploadprofie
  const uploadProf = async (data: any) => {
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/ddos89bpu/image/upload`,
        data
      );
      setValue("profile_img", response.data.secure_url);
      setisProfileUploading(false);
    } catch (error) {
      console.log(error);
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
      queryClient.invalidateQueries({ queryKey: ["GetAllCourts"] });
      // reset(response.data);
      toast.success(response.message);
    } catch (error) {
      console.log(error, "eroor");
    }
  };

  const onSubmit = async () => {
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
    <Modal open={isOpen} footer={null} closable>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="profile_img"
          control={control}
          rules={{ required: true }}
          render={() => (
            <Form.Item label="CourtImg">
              {profile_url ? (
                <img className="w-36 h-36" src={profile_url} />
              ) : (
                <input type="file" />
              )}
            </Form.Item>
          )}
        />

        <Controller
          name="courtName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Form.Item label="Court Name" required>
              <Input {...field} />
            </Form.Item>
          )}
        />

        <Controller
          name="sportsAvailable"
          control={control}
          render={({ field }) => (
            <Form.Item required label="Sports Available">
              <Select
                mode="multiple"
                {...field}
                showSearch
                allowClear
                options={sports?.map((item: string) => ({
                  value: item,
                  label: item,
                }))}
              />
              {/* <Select
                    options={}
                    {...field}
                    placeholder="Select Sports"
                  ></Select> */}
            </Form.Item>
          )}
        />

        <Controller
          name="pricePerHour"
          control={control}
          render={({ field }) => (
            <Form.Item label="Price per Hour ($)">
              <Input type="number" {...field} />
            </Form.Item>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Form.Item label="Availability">
              <Select {...field}>
                <Select.Option value="Available">Available</Select.Option>
                <Select.Option value="Unavailable">Unavailable</Select.Option>
                <Select.Option value="Maintenance">Maintenance</Select.Option>
              </Select>
            </Form.Item>
          )}
        />

        <Controller
          name="location.state"
          control={control}
          render={({ field }) => (
            <Form.Item label="State">
              <Select
                {...field}
                options={Object.keys(AllLocation)?.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </Form.Item>
          )}
        />
        <Controller
          name="location.city"
          control={control}
          render={({ field }) => (
            <Form.Item label="city">
              <Select
                showSearch
                {...field}
                options={(
                  (AllLocation as Record<string, string[]>)[location.state] ||
                  []
                )?.map((item: string) => ({
                  value: item,
                  label: item,
                }))}
              />
            </Form.Item>
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Form.Item label="Google maps Address URL">
              <Input type="url" {...field} />
            </Form.Item>
          )}
        />

        <Form.Item label="Additional Images">
          {(watch("other_img") || []).map((img, index) => (
            <Space key={index} align="center">
              <img
                src={img}
                alt={`img-${index}`}
                width={60}
                height={60}
                style={{ borderRadius: 4 }}
              />
              {/* <Button
                    onClick={() => handleImageUpload("otherImages", index)}
                  >
                    Change
                  </Button>
                  <Button
                    icon={<CloseOutlined />}
                    onClick={() => removeOtherImage(index)}
                  /> */}
            </Space>
          ))}
          {/* <Button
                icon={<PlusOutlined />}
                onClick={() => handleImageUpload("otherImages")}
              >
                Add Image
              </Button> */}
        </Form.Item>

        {/* {!isCreating && ( */}
        <Button danger>Delete Court</Button>
        {/* )} */}

        <Space>
          <Button htmlType="button">Cancel</Button>
          <Button type="primary" htmlType="submit">
            {/* {isCreating ? "Create Court" : "Save Changes"} */}
            save
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default SingleCourtData;
