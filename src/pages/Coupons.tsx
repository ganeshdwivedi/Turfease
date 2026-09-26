import { useQuery } from "@tanstack/react-query";
import { Button, Card, Empty, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { apiCaller } from "../api/ApiCaller";

interface Coupon {
  _id: string;
  couponName: string;
  isActive: boolean;
  minPurchase: number;
  discount: number;
  type: "number" | "percentage";
}

interface CouponResponse {
  message: string;
  data: Coupon[];
}

const fetchCoupons = async (): Promise<CouponResponse> => {
  const response = await apiCaller("/coupons");
  return response?.data
};

const Coupons = () => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<CouponResponse>({
    queryKey: ["coupons"],
    queryFn: fetchCoupons,
  });

  const coupons = data?.data ?? [];

  const columns: ColumnsType<Coupon> = [
    {
      title: "Coupon",
      dataIndex: "couponName",
      key: "couponName",
      render: (name: string) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">
            {name.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="font-medium text-gray-900">{name}</div>
            <div className="text-xs text-gray-400">Coupon Code</div>
          </div>
        </div>
      ),
    },

    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 130,
      render: (isActive: boolean) => (
        <Tag
          color={isActive ? "success" : "default"}
          className="rounded-full px-3 py-1"
        >
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },

    {
      title: "Minimum Purchase",
      dataIndex: "minPurchase",
      key: "minPurchase",
      width: 180,
      render: (amount: number) => (
        <span className="font-medium text-gray-700">
          ₹{amount.toLocaleString("en-IN")}
        </span>
      ),
    },

    {
      title: "Discount",
      key: "discount",
      width: 150,
      render: (_, record) => (
        <span className="font-semibold text-gray-900">
          {record.discount}
          {record.type === "percentage" ? "%" : " OFF"}
        </span>
      ),
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 130,
      render: (type: string) => (
        <Tag className="capitalize">
          {type === "number" ? "Fixed Amount" : "Percentage"}
        </Tag>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit coupon">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => console.log("Edit", record._id)}
            />
          </Tooltip>

          <Tooltip title="Delete coupon">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log("Delete", record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-full p-3">
      {/* Header */}
      <div className="mb-6 flex justify-end">

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => console.log("Create coupon")}
        >
          Create Coupon
        </Button>
      </div>

      {/* Summary */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card bordered={false} className="shadow-sm">
          <div className="text-sm text-gray-500">Total Coupons</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {coupons.length}
          </div>
        </Card>

        <Card bordered={false} className="shadow-sm">
          <div className="text-sm text-gray-500">Active Coupons</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">
            {coupons.filter((coupon) => coupon.isActive).length}
          </div>
        </Card>

        <Card bordered={false} className="shadow-sm">
          <div className="text-sm text-gray-500">Inactive Coupons</div>
          <div className="mt-1 text-2xl font-semibold text-gray-500">
            {coupons.filter((coupon) => !coupon.isActive).length}
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card
        bordered={false}
        className="overflow-hidden shadow-sm"
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              All Coupons
            </h2>

            <p className="mt-0.5 text-sm text-gray-400">
              View and manage your available coupons.
            </p>
          </div>

          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined spin={isFetching} />}
              onClick={() => refetch()}
            />
          </Tooltip>
        </div>

        <Table<Coupon>
          rowKey="_id"
          columns={columns}
          dataSource={coupons}
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} coupons`,
          }}
          locale={{
            emptyText: isError ? (
              <Empty
                description="Unable to load coupons"
              />
            ) : (
              <Empty description="No coupons found" />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default Coupons;