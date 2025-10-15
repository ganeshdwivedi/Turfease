import { Divider } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 mt-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link to="#" className="text-3xl font-bold !text-[#508267]">
            Courtify
          </Link>
          <p className="mt-2 text-gray-500 text-sm">
            Your Court, Your Game. Booked in seconds.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Company</h4>
          <ul className="mt-4 space-y-2 !text-gray-600 text-sm">
            <li>
              <Link to="/" className="hover:!text-[#508267] !text-gray-600">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:!text-[#508267] !text-gray-600">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:!text-[#508267] !text-gray-600">
                Press
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Support</h4>
          <ul className="mt-4 space-y-2 text-gray-600 text-sm">
            <li>
              <Link to="#" className="hover:!text-[#508267] !text-gray-600">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:!text-[#508267] !text-gray-600">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:!text-[#508267] !text-gray-600">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Legal</h4>
          <ul className="mt-4 space-y-2 text-gray-600 text-sm">
            <li>
              <Link to="#" className="hover:!text-[#508267] !text-gray-600">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:!text-[#508267] !text-gray-600">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <Divider />
      <div>
        <p className="text-sm text-gray-500 !text-center">
          &copy; {new Date().getFullYear()} Courtify. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
