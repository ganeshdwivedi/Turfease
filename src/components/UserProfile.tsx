import { Avatar } from "antd";
import React from "react";
import type { Customer } from "../Types/Customer";

interface UserProfileInterface {
  user: Customer;
  className?: string;
}

const UserProfile = ({ user, className }: UserProfileInterface) => {
  return (
    <div className={`flex flex-row items-center gap-3 ${className}`}>
      <Avatar src={user?.profile} alt="profile-img" shape="circle" />
      <div>
        <h3 className="text-sm font-semibold">{user?.name}</h3>
        <p className="text-sm">{user?.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
