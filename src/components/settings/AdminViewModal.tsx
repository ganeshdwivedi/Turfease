import React, { useEffect } from "react";
import type { IGetAdmin } from "../../Types/Admin";
import { useForm } from "react-hook-form";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  List,
  Modal,
  Switch,
  Tabs,
  Typography,
} from "antd";
const { Title } = Typography;

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
  admin: IGetAdmin;
  isOpen: boolean;
  onOpenChange: any;
}) => {
  const { register, watch, control, setValue, handleSubmit, reset } =
    useForm<formInput>();
  // const { name, email, number, avatar, status, active } = watch();

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
    <Modal footer={null} open={isOpen} centered closable onCancel={handleclose}>
      {/* <div>
            <img
              className="rounded-full w-16 h-16"
              src={avatar}
              alt="admin-img"
            />
          </div> */}

      <Card className="!my-4 shadow-btnInset">
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Avatar size={80} src={admin.profile} />
          <div style={{ flex: 1 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Name">{admin.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{admin.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">
                {admin.phone_number ?? "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>

      {/* Tabs Section */}
      <Tabs
        defaultActiveKey="courts"
        items={[
          {
            key: "courts",
            label: "Courts",
            children: (
              <List
                itemLayout="vertical"
                dataSource={admin?.turf}
                renderItem={(court: any) => (
                  <Card key={court._id} className="mb-3" hoverable>
                    <div style={{ display: "flex", gap: 16 }}>
                      <Avatar
                        shape="square"
                        size={80}
                        src={court.profile_img}
                      />
                      <div style={{ flex: 1 }}>
                        <Title level={5}>{court.courtName}</Title>
                        <p className="!text-sm">
                          <strong>Location:</strong> {court.location.city},{" "}
                          {court.location.state}
                        </p>
                        <p className="!text-sm">
                          <strong>Sports:</strong>{" "}
                          {court.sportsAvailable.join(", ")}
                        </p>
                        <p className="!text-sm">
                          <strong>Working Hours:</strong>{" "}
                          {court.workingHours.start} - {court.workingHours.end}
                        </p>
                        <p className="!text-sm">
                          <strong>Price/Hour:</strong> ₹{court.pricePerHour}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              />
            ),
          },
          {
            key: "bookings",
            label: "Bookings",
            children: <p>No bookings yet</p>,
          },
        ]}
      />
    </Modal>
  );
};

export default AdminViewModal;
