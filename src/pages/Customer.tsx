import React from "react";
import CustomerTable from "../components/customer/CustomerTable";

const Customer = () => {
  return (
    <div className="m-2">
      <div className="text-center font-semibold text-lg mt-3 mb-5">Customers</div>
      <CustomerTable />
    </div>
  );
};

export default Customer;
