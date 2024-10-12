import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@nextui-org/react";
import React from "react";

const PopoverEvent = ({
  eventData,
  isOpen,
}: {
  eventData: any;
  isOpen?: boolean;
}) => {
  return (
    <Popover
      isOpen={isOpen}
      // onClose={() => setPopoverVisible(false)}
      placement="top"
    >
      <PopoverTrigger>.</PopoverTrigger>
      <PopoverContent>
        <p className="font-medium">
          {eventData.ST} - {eventData.ET}
        </p>
        <p>Players 1/3</p>
        <User
          className="font-medium"
          avatarProps={{ radius: "full", src: eventData?.customer.profile }}
          description={eventData?.customer.email}
          name={eventData?.customer.name}
        />
      </PopoverContent>
    </Popover>
  );
};

export default PopoverEvent;
