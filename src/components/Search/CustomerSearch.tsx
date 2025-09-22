import React, { useState } from "react";
import { Select, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiCaller } from "../../api/ApiCaller";
import type { Customer } from "../../Types/Customer";
import { DebouncedInput } from "../settings/DebounceInput";
import { BiSearch } from "react-icons/bi";
import UserProfile from "../UserProfile";
const { Option } = Select;

interface CustomerSearchSelectProps {
  value?: string; // selected customer ID
  onChange?: (value: string) => void;
  placeholder?: string;
}

interface ApiResponse {
  total: number;
  customers: Customer[];
}

export const CustomerSearchSelect: React.FC<CustomerSearchSelectProps> = ({
  value,
  onChange,
  placeholder = "Select customer",
}) => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["GetAllCustomer", search],
    queryFn: async () => {
      const response = await apiCaller.get(`/customers`, {
        params: { search },
      });

      console.log(response, "res-->");
      return response?.data?.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  console.log(data);

  return (
    <Select
      allowClear
      size="large"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      filterOption={false}
      showSearch={false} // disable built-in search box
      notFoundContent={isLoading ? <Spin size="small" /> : "No customers found"}
      style={{ width: "100%" }}
    >
      <Option disabled key="__search__" value="__search__">
        <div
          className="my-2"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <DebouncedInput
            value={search}
            delay={500}
            prefix={<BiSearch />}
            placeholder="Search customer..."
            onDebounce={(val) => setSearch(val)}
          />
        </div>
      </Option>
      {data?.customers?.map((customer) => (
        <Option key={customer._id} value={customer._id}>
          <UserProfile user={customer} />
        </Option>
      ))}
    </Select>
  );
};
