import React, { Profiler, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Upload,
  TimePicker,
  Modal,
  Row,
  Col,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { CourtStatus, type Court, type ICourt } from "../../Types/Court";
import dayjs from "dayjs";
import { appApiCaller } from "../../api/appApiCaller";
import { closeModal, unSelectCourt } from "../../redux/courtSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCaller } from "../../api/ApiCaller";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import AddressAutocomplete from "../../components/select/SelectAdress";
import { useToast } from "../../components/ToastProvider";

const { Option } = Select;

const CreateCourtModale = () => {
  const antToast = useToast();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isOpen, court, mode } = useSelector(
    (state: RootState) => state.court
  );
  const isReadOnly = mode === "view";
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICourt>({
    defaultValues: court
      ? court
      : {
          status: CourtStatus.AVAILABLE,
        },
  });
  const { append, update, fields } = useFieldArray({
    control,
    name: "other_url",
  });

  const handleClose = () => {
    dispatch(unSelectCourt({ court: null, mode: "view", isOpen: false }));
  };

  // ============================= handle before upload profile =============================
  const handleBeforeUploadProfile = async (file: any) => {
    const formData = new FormData();

    const fileUrl = URL.createObjectURL(file);
    const tempFile = {
      uid: file.uid || Date.now().toString(),
      name: file.name,
      url: fileUrl,
      status: "pending" as const,
    };
    formData.append("file", file);

    try {
      const res = await appApiCaller.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setValue("profile_url", res.data);
    } catch (error) {
      const index = fields.findIndex((f) => f.uid === tempFile.uid);
      if (index > -1) {
        setValue("profile_url", { ...tempFile, status: "error" as const });
      }

      console.error("Upload error:", error);
    }

    return false;
  };

  // ==================== handle before upload other_img =============================
  const handleBeforeUpload = async (file: any) => {
    const formData = new FormData();

    const fileUrl = URL.createObjectURL(file);
    const tempFile = {
      uid: file.uid || Date.now().toString(),
      name: file.name,
      url: fileUrl,
      status: "pending" as const,
    };
    formData.append("file", file);
    append(tempFile);

    try {
      const res = await appApiCaller.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded = {
        ...tempFile,
        url: res.data.url,
        status: "success" as const,
      };

      const index = fields.findIndex((f) => f.uid === tempFile.uid);
      if (index > -1) {
        update(index, uploaded);
      }
    } catch (error) {
      const index = fields.findIndex((f) => f.uid === tempFile.uid);
      if (index > -1) {
        update(index, { ...tempFile, status: "error" as const });
      }

      console.error("Upload error:", error);
    }

    return false; // 🚨 Prevent AntD's default upload
  };

  const { mutate: createCourt } = useMutation({
    mutationFn: async (apiData: ICourt) =>
      await apiCaller.post("/court", apiData),
    onSuccess: () => {
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["GetAllCourts"] });
    },
    onError: (error) => {
      antToast.error("Failed to create court. Please try again.");
      console.error("Error creating court:", error);
    },
  });

  const { mutate: updateCourt } = useMutation({
    mutationFn: async ({
      court_id,
      apiData,
    }: {
      court_id: string;
      apiData: any;
    }) => await apiCaller.patch(`/court/${court_id}`, apiData),
    onSuccess: () => {
      handleClose();

      queryClient.invalidateQueries({ queryKey: ["GetAllCourts"] });
    },
  });

  // ============================= handle submit =============================

  const onSubmit = (data: any) => {
    delete data._id;
    const payload = {
      ...(data || {}),
      profile_img: data?.profile_url?.url || data?.profile_img,
      other_img: [
        ...(data?.other_img ?? []),
        ...(data?.other_url?.map((file: any) =>
          typeof file === "string" ? file : file.url
        ) ?? []),
      ], // ✅ send only URLs
    };

    if (court?._id) {
      updateCourt({ apiData: payload, court_id: court._id });
      return;
    }
    createCourt(payload);
  };

  useEffect(() => {
    if (court) {
      reset(court);
    } else {
      reset({ status: CourtStatus.AVAILABLE });
    }
  }, [court]);

  const handlePlaceSelected = (place: any) => {
    console.log("Selected Place Details:", place);
  };

  console.log(watch(), "wathchhh");

  return (
    <Modal
      title="Create New Court"
      open={isOpen}
      closable
      footer={null}
      centered
      onCancel={handleClose}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Court Name */}
        <Form.Item
          label="Court Name"
          validateStatus={errors.courtName ? "error" : ""}
          help={errors.courtName?.message}
        >
          <Controller
            name="courtName"
            control={control}
            rules={{ required: "Court Name is required" }}
            render={({ field }) => (
              <Input
                disabled={isReadOnly}
                {...field}
                placeholder="Enter court name"
              />
            )}
          />
        </Form.Item>

        {/* Address */}

        {/* <StateCitySelector control={control} name="location" setValue={setValue} watch={watch} /> */}

        {/* Location */}
        {/* <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="State"
              validateStatus={errors.location?.state ? "error" : ""}
              help={errors.location?.state?.message}
            >
              <Controller
                disabled={isReadOnly}
                name="location.state"
                control={control}
                rules={{ required: "State is required" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter state" />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="City"
              validateStatus={errors.location?.city ? "error" : ""}
              help={errors.location?.city?.message}
            >
              <Controller
                disabled={isReadOnly}
                name="location.city"
                control={control}
                rules={{ required: "City is required" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter city" />
                )}
              />
            </Form.Item>
          </Col>
        </Row> */}

        <Row gutter={24}>
          <Col span={12}>
            {/* Sports Available */}
            <Form.Item label="Sports Available">
              <Controller
                disabled={isReadOnly}
                name="sportsAvailable"
                control={control}
                render={({ field }) => (
                  <Select {...field} mode="tags" placeholder="Enter sports">
                    <Option value="Football">Football</Option>
                    <Option value="Badminton">Badminton</Option>
                    <Option value="Tennis">Tennis</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* Contact Number */}
            <Form.Item
              label="Contact Number"
              validateStatus={errors.contactNumber ? "error" : ""}
              help={errors.contactNumber?.message}
            >
              <Controller
                disabled={isReadOnly}
                name="contactNumber"
                control={control}
                rules={{ required: "Contact number is required" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter contact number" />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            {/* Profile Image */}
            <Form.Item label="Profile Image">
              <Upload
                disabled={isReadOnly}
                maxCount={1}
                beforeUpload={handleBeforeUploadProfile}
              >
                <Button icon={<AiOutlineCloudUpload />}>
                  Upload Profile Image
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* Other Images */}
            <Form.Item label="Other Images">
              <Upload
                disabled={isReadOnly}
                multiple
                beforeUpload={handleBeforeUpload}
              >
                <Button icon={<AiOutlineCloudUpload />}>
                  Upload Other Images
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Status">
              <Controller
                disabled={isReadOnly}
                name="status"
                control={control}
                render={({ field }) => (
                  <Select {...field} defaultValue="Available">
                    <Option value="Available">Available</Option>
                    <Option value="Unavailable">Unavailable</Option>
                    <Option value="Maintenance">Maintenance</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* Price per Hour */}
            <Form.Item
              label="Price per Hour"
              validateStatus={errors.pricePerHour ? "error" : ""}
              help={errors.pricePerHour?.message}
            >
              <Controller
                disabled={isReadOnly}
                name="pricePerHour"
                control={control}
                rules={{ required: "Price per hour is required" }}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: "100%" }}
                    placeholder="Enter price"
                    min={0}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* Status */}

        {/* Working Hours */}
        <Row gutter={24}>
          <Col span={12}>
            <Controller
              disabled={isReadOnly}
              name="workingHours.start"
              control={control}
              rules={{ required: "Start time is required" }}
              render={({
                field: { onChange, value, ref, ...rest },
                fieldState: { error },
              }) => (
                <Form.Item
                  label="Start Time"
                  validateStatus={error ? "error" : ""}
                  help={error?.message}
                >
                  <TimePicker
                    className="!w-full"
                    {...rest}
                    minuteStep={30}
                    ref={ref}
                    format="HH:mm a"
                    value={value ? dayjs(value, "HH:mm") : null}
                    onChange={(time) =>
                      onChange(time ? time.format("HH:mm") : null)
                    }
                  />
                </Form.Item>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              disabled={isReadOnly}
              name="workingHours.end"
              control={control}
              rules={{ required: "End time is required" }}
              render={({
                field: { onChange, value, ref, ...rest },
                fieldState: { error },
              }) => (
                <Form.Item
                  label="End Time"
                  validateStatus={error ? "error" : ""}
                  help={error?.message}
                >
                  <TimePicker
                    className="!w-full"
                    minuteStep={30}
                    {...rest}
                    ref={ref}
                    format="HH:mm a"
                    value={value ? dayjs(value, "HH:mm") : null} // ✅ convert string → Dayjs
                    onChange={(time) =>
                      onChange(time ? time.format("HH:mm") : null)
                    } // ✅ convert Dayjs → string
                  />
                </Form.Item>
              )}
            />
          </Col>
        </Row>

        <Form.Item
          label="Address"
          validateStatus={errors.address ? "error" : ""}
          help={errors.address?.message}
        >
          <Controller
            disabled={isReadOnly}
            name="address"
            control={control}
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <Input.TextArea {...field} placeholder="Enter address" />
            )}
          />
        </Form.Item>

        <Col>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <Form.Item label="Select Location">
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY!}
                  libraries={["places"]}
                >
                  <AddressAutocomplete
                    value={value}
                    onPlaceSelected={(data: any) => onChange(data)}
                  />
                </LoadScript>
              </Form.Item>
            )}
          />
        </Col>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Court
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCourtModale;
