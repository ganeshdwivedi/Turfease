import React from "react";
import { Breadcrumb, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
const { Title } = Typography;
const breadcrumbNameMap: Record<string, string> = {
  "/calendars": "Calendars",
  "/courts": "Courts",
  "/payments": "Payments",
  "/customers": "Customers",
  "/settings": "Settings",
  "/logout": "Logout",
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  // Build breadcrumb items dynamically
  const breadcrumbItems = [
    {
      key: "home",
      title: (
        <div>
          <Link to="/calendars" className="hover:text-green-600">
            Home
          </Link>
        </div>
      ),
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const isLast = index === pathSnippets.length - 1;

      return {
        key: url,
        title: (
          <>
            {isLast ? (
              <span className="font-semibold text-green-700">
                {breadcrumbNameMap[url] || url}
              </span>
            ) : (
              <Link to={url} className="hover:text-green-600">
                {breadcrumbNameMap[url] || url}
              </Link>
            )}
          </>
        ),
      };
    }),
  ];

  return (
    <div className="p-3 bg-none  mb-4">
      <Title
        className="!text-primary capitalize !text-[#508267] !mb-0"
        level={2}
      >
        {pathSnippets?.pop() || "Home"}
      </Title>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default Breadcrumbs;
