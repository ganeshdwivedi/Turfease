import React, { useState } from "react";
import type { Customer } from "../../Types/Customer";
import { IoEyeOutline } from "react-icons/io5";
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import CustomerModel from "./CustomerModel";
import {
  Avatar,
  Badge,
  Button,
  Select,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiCaller } from "../../api/ApiCaller";
import { DebouncedInput } from "../settings/DebounceInput";
import { CiSearch } from "react-icons/ci";
import { TableQueryHOC, type TableQueryInjectedProps } from "../HOCTable";

const CustomerTable: React.FC<TableQueryInjectedProps> = ({
  params,
  onChange,
  onSearch,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["GetAllCustomer", params],
    queryFn: async () => {
      const response = await apiCaller.get(`/customers`, {
        params: {
          limit: params.limit,
          page: params?.offset,
          search: params.search,
          // sortBy: params.sortBy,
          // sortOrder: params.sortOrder,
        },
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleCustomerSelect = (user: Customer) => {
    setSelectedCustomer(user);
    setIsOpen(true);
  };

  console.log(data, "customer data");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, user: Customer) => (
        <div className="flex flex-row items-center gap-2">
          <Avatar
            size="small"
            src={user.profile || "/placeholder-img.jpg"}
            icon={user?.name.charAt(0)}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{user.name}</div>
            <div style={{ color: "#888", fontSize: 12 }}>{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={"green"}>Active</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, user: Customer) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Tooltip title="Details">
            <IoEyeOutline
              style={{ cursor: "pointer" }}
              onClick={() => handleCustomerSelect(user)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <BiSolidEditAlt style={{ cursor: "pointer" }} />
          </Tooltip>
          <Tooltip title="Delete">
            <RiDeleteBinLine style={{ cursor: "pointer", color: "red" }} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <DebouncedInput
          delay={700}
          placeholder="Search by name..."
          prefix={<CiSearch />}
          value={params?.search || ""}
          onDebounce={(val: string) => onSearch(val)}
          allowClear
          style={{ width: "40%" }}
        />

        {/* <Select
                value={search}
                onChange={(v) => setSearch(v)}
                style={{ width: 150 }}
              >
                {statusOptions.map((s) => (
                  <Option key={s.uid} value={s.uid}>
                    {s.name}
                  </Option>
                ))} 
              </Select> */}
        <Button
          onClick={() => {
            setSelectedCustomer(null);
            setIsOpen(true);
          }}
          type="primary"
        >
          Add New
        </Button>
      </div>
      <Table
        rowKey="_id"
        pagination={{
          current: params.offset,
          pageSize: params.limit,
          total: data?.total || 0,
        }}
        loading={isLoading}
        columns={columns}
        onChange={(pagination, filters, sorter) => {
          // just forward values, ignore `extra`
          onChange(pagination, filters, sorter);
        }}
        dataSource={data?.customers}
      />
      <CustomerModel
        customer={selectedCustomer}
        isOpen={isOpen}
        onOpenChange={(value: boolean) => setIsOpen(value)}
      />
    </div>
  );
};

export default TableQueryHOC(CustomerTable);
