// SettingsTable.tsx
import React, { useState } from "react";
import {
  Table,
  Select,
  Button,
  Tag,
  Tooltip,
  Avatar,
  Badge,
  Typography,
} from "antd";
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import AdminViewModal from "./AdminViewModal";
import { useQuery } from "@tanstack/react-query";
import { apiCaller } from "../../api/ApiCaller";
import { DebouncedInput } from "./DebounceInput";
import type { IGetAdmin } from "../../Types/Admin";
import { TableQueryHOC, type TableQueryInjectedProps } from "../HOCTable";
const { Option } = Select;

export interface UserType {
  _id: number;
  name: string;
  email: string;
  profile?: string;
}

const statusOptions = [
  { uid: "all", name: "All" },
  { uid: "active", name: "Active" },
  { uid: "inactive", name: "Inactive" },
];

const SettingsTableComponent: React.FC<TableQueryInjectedProps> = ({
  params,
  onChange,
  onSearch,
}) => {
  // const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAdmin, setSelectedAdmin] = useState<IGetAdmin | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["GetAllAdmin", params],
    queryFn: async () => {
      const response = await apiCaller.get(`/allAdmin`, {
        params: {
          limit: params.limit,
          offset: (params.offset - 1) * params.limit,
          search: params.search,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          ...params.filters, // backend must handle filters[key]=value
        },
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, user: IGetAdmin) => (
        <div className="flex flex-row items-center gap-2">
          <Avatar size="small" src={user.profile} icon={user?.name.charAt(0)} />
          <div>
            <div style={{ fontWeight: 500 }}>{user.name}</div>
            <div style={{ color: "#888", fontSize: 12 }}>{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Court",
      dataIndex: "court",
      key: "court",
      render: (_: any, datd: any) => {
        const turfLength = datd?.turf?.length - 1 || 0;
        return (
          <div>
            <Badge count={turfLength} overflowCount={9}>
              <Typography.Text>{datd?.turf?.[0]?.courtName}</Typography.Text>
            </Badge>
          </div>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => <Tag color={"green"}>Active</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, user: IGetAdmin) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Tooltip title="Details">
            <IoEyeOutline
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedAdmin(user)}
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
    <>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <DebouncedInput
          delay={700}
          placeholder="Search by name..."
          prefix={<CiSearch />}
          value={params.search || ""}
          onDebounce={(val: string) => {
            onSearch(val);
          }}
          allowClear
          style={{ width: "40%" }}
        />

        <Select
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          style={{ width: 150 }}
        >
          {statusOptions.map((s) => (
            <Option key={s.uid} value={s.uid}>
              {s.name}
            </Option>
          ))}
        </Select>
        <Button type="primary">Add New</Button>
      </div>

      <Table
         scroll={{ x: 700 }}
        rowKey="_id"
        pagination={{
          current: params.offset,
          pageSize: params.limit,
          total: data?.total || 0,
        }}
        onChange={(pagination, filters, sorter) => {
          // just forward values, ignore `extra`
          onChange(pagination, filters, sorter);
        }}
        loading={isLoading}
        columns={columns}
        dataSource={data?.admins}
      />

      {selectedAdmin && (
        <AdminViewModal
          admin={selectedAdmin}
          isOpen={!!selectedAdmin}
          onOpenChange={() => setSelectedAdmin(null)}
        />
      )}
    </>
  );
};

export default TableQueryHOC(SettingsTableComponent);
