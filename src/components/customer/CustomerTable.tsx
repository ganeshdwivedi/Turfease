import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Customer from "../../Types/Customer";
import useGetAllCustomer from "../../customHook/useGetAllCustomer";
import { IoEyeOutline } from "react-icons/io5";
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";

const InitialColumns = [
  { name: "Name", id: "name", sortable: true },
  { name: "Phone number", id: "phone_number", sortable: true },
  { name: "Action", id: 3 },
];
const CustomerTable = () => {
  const { isSuccess, data, isError } = useGetAllCustomer();
  const [allCustomer, setAllCustomer] = useState<Customer[]>([]);
  const [sortedData, setSortedData] = useState<Customer[]>([]);
  const [sortDescriptor, setSortDescriptor] = React.useState<any>({
    column: "Name",
    direction: "ascending",
  });

  useEffect(() => {
    if (isSuccess) {
      setAllCustomer(data);
      setSortedData(data);
    }
  }, [isSuccess, data, isError]);

  const sortedItems = React.useMemo(() => {
    return [...sortedData].sort((a: Customer, b: Customer) => {
      const first = a[sortDescriptor.column as keyof Customer];
      const second = b[sortDescriptor.column as keyof Customer];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor]);

  useEffect(() => {
    if (!!sortedItems?.length) {
      setSortedData(sortedItems);
    }
  }, [sortedItems]);

  return (
    <div>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        classNames={
          {
            // wrapper: "max-h-[382px]",
          }
        }
      >
        <TableHeader columns={InitialColumns}>
          {(column) => (
            <TableColumn
              allowsSorting={column.sortable}
              className=" font-bold text-sm"
              key={column.id}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedData}>
          {(item) => (
            <TableRow key={item._id}>
              {/* {(columnKey) => ( */}
              <TableCell>
                <User
                  className="font-medium"
                  avatarProps={{ radius: "lg", src: item.profile }}
                  description={item.email}
                  name={item.name}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p className="font-medium text-small capitalize">
                    {item.phone_number}
                  </p>
                  <p className="font-regular text-tiny capitalize text-default-400">
                    {/* {item.} */}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="relative flex justify-start items-center gap-2">
                  <Tooltip content="Details">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <IoEyeOutline />
                    </span>
                  </Tooltip>
                  <Tooltip content="Edit user">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <BiSolidEditAlt />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete user">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                      <RiDeleteBinLine />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>

              {/* )} */}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
