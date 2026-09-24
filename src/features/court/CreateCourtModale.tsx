import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useForm, Controller } from "react-hook-form";
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
import { CourtStatus, type ICourt } from "../../Types/Court";
import dayjs from "dayjs";
import { appApiCaller } from "../../api/appApiCaller";
import { unSelectCourt } from "../../redux/courtSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCaller } from "../../api/ApiCaller";
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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICourt>({
    defaultValues: {
      status: CourtStatus.AVAILABLE,
      profile_url: [],
      other_url: [],
    },
  });

  const handleClose = () => {
    dispatch(unSelectCourt({ court: null, mode: "view", isOpen: false }));
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    }
    setPreviewImage(file.url || file.preview || "");
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || (file.url ? file.url.substring(file.url.lastIndexOf("/") + 1) : "Image Preview")
    );
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
    onError: (error) => {
      antToast.error("Failed to update court. Please try again.");
      console.error("Error updating court:", error);
    },
  });

  const onSubmit = (data: any) => {
    const payloadData = { ...data };
    delete payloadData._id;

    let profileImg = payloadData.profile_img || "";
    if (Array.isArray(payloadData.profile_url) && payloadData.profile_url.length > 0) {
      const p = payloadData.profile_url[0];
      profileImg = typeof p === "string" ? p : p.url || p.response?.url || profileImg;
    }

    const otherImg = (payloadData.other_url || [])
      .filter(
        (file: any) =>
          file && (file.status === "done" || !file.status || file.url)
      )
      .map((file: any) => (typeof file === "string" ? file : file.url || file.response?.url))
      .filter(Boolean);

    const payload = {
      ...payloadData,
      profile_img: profileImg,
      other_img: otherImg,
    };
    delete payload.profile_url;
    delete payload.other_url;

    if (court?._id) {
      updateCourt({ apiData: payload, court_id: court._id });
      return;
    }
    createCourt(payload);
  };

  useEffect(() => {
    if (court) {
      const initialProfileUrl = court.profile_img
        ? [
            {
              uid: "-1",
              name: "profile.png",
              status: "done" as const,
              url: court.profile_img,
            },
          ]
        : [];

      const initialOtherUrls = Array.isArray(court.other_img)
        ? court.other_img.map((url: string, index: number) => ({
            uid: `existing-other-${index}`,
            name: `image-${index + 1}.png`,
            status: "done" as const,
            url: url,
          }))
        : [];

      reset({
        ...court,
        profile_url: initialProfileUrl,
        other_url: initialOtherUrls,
      });
    } else {
      reset({
        status: CourtStatus.AVAILABLE,
        profile_url: [],
        other_url: [],
      });
    }
  }, [court, reset, isOpen]);

  useEffect(() => {
    if ((window as any).umami) {
      if (!court) {
        (window as any).umami.track("Court Create");
      } else {
        (window as any).umami.track("Court View", {
          courtID: court?._id || "no court Id",
          courtName: court?.courtName,
          courtImage: court?.profile_img,
        });
      }
    } else {
      console.warn("Umami not loaded yet");
    }
  }, [court]);

  return (
    <>
      <Modal
        title={court ? (isReadOnly ? "View Court" : "Edit Court") : "Create New Court"}
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

          <Row gutter={24}>
            <Col span={12}>
              {/* Profile Image */}
              <Form.Item label="Profile Image">
                <Controller
                  name="profile_url"
                  control={control}
                  render={({ field: { value = [], onChange } }) => (
                    <Upload
                      disabled={isReadOnly}
                      listType="picture-card"
                      maxCount={1}
                      fileList={Array.isArray(value) ? value : []}
                      onPreview={handlePreview}
                      onRemove={() => {
                        onChange([]);
                      }}
                      beforeUpload={async (file) => {
                        const formData = new FormData();
                        const fileUrl = URL.createObjectURL(file);
                        const tempFile = {
                          uid: file.uid || Date.now().toString(),
                          name: file.name,
                          url: fileUrl,
                          status: "uploading" as const,
                        };
                        onChange([tempFile]);

                        formData.append("file", file);
                        try {
                          const res = await appApiCaller.post("/upload", formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                          });
                          const uploadedUrl = res.data?.url || res.data;
                          const uploadedFile = {
                            ...tempFile,
                            url: uploadedUrl,
                            status: "done" as const,
                          };
                          onChange([uploadedFile]);
                        } catch (error) {
                          antToast.error("Failed to upload profile image");
                          onChange([{ ...tempFile, status: "error" as const }]);
                        }
                        return false;
                      }}
                    >
                      {(Array.isArray(value) && value.length >= 1) || isReadOnly ? null : (
                        <div className="flex flex-col items-center justify-center">
                          <AiOutlineCloudUpload className="text-2xl" />
                          <div className="mt-1 text-xs">Upload</div>
                        </div>
                      )}
                    </Upload>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* Other Images */}
              <Form.Item label="Other Images">
                <Controller
                  name="other_url"
                  control={control}
                  render={({ field: { value = [], onChange } }) => (
                    <Upload
                      disabled={isReadOnly}
                      listType="picture-card"
                      multiple
                      fileList={Array.isArray(value) ? value : []}
                      onPreview={handlePreview}
                      onRemove={(file) => {
                        const updated = (Array.isArray(value) ? value : []).filter(
                          (item: any) => item.uid !== file.uid
                        );
                        onChange(updated);
                      }}
                      beforeUpload={async (file) => {
                        const formData = new FormData();
                        const fileUrl = URL.createObjectURL(file);
                        const tempFile = {
                          uid: file.uid || `${Date.now()}-${Math.random()}`,
                          name: file.name,
                          url: fileUrl,
                          status: "uploading" as const,
                        };
                        const currentList = Array.isArray(value) ? value : [];
                        const newList = [...currentList, tempFile];
                        onChange(newList);

                        formData.append("file", file);
                        try {
                          const res = await appApiCaller.post("/upload", formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                          });
                          const uploadedUrl = res.data?.url || res.data;
                          const updated = newList.map((f: any) =>
                            f.uid === tempFile.uid
                              ? { ...f, url: uploadedUrl, status: "done" as const }
                              : f
                          );
                          onChange(updated);
                        } catch (error) {
                          antToast.error("Failed to upload image");
                          const updated = newList.map((f: any) =>
                            f.uid === tempFile.uid
                              ? { ...f, status: "error" as const }
                              : f
                          );
                          onChange(updated);
                        }
                        return false;
                      }}
                    >
                      {isReadOnly ? null : (
                        <div className="flex flex-col items-center justify-center">
                          <AiOutlineCloudUpload className="text-2xl" />
                          <div className="mt-1 text-xs">Upload</div>
                        </div>
                      )}
                    </Upload>
                  )}
                />
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
                      value={value ? dayjs(value, "HH:mm") : null}
                      onChange={(time) =>
                        onChange(time ? time.format("HH:mm") : null)
                      }
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
                  <AddressAutocomplete
                    value={value}
                    onPlaceSelected={(data: any) => onChange(data)}
                  />
                </Form.Item>
              )}
            />
          </Col>

          {/* Submit Button */}
          {!isReadOnly && (
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit Court
              </Button>
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default CreateCourtModale;

