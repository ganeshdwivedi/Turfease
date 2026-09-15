import React, { useState } from "react";

const RenderEventContent = ({ eventInfo }: { eventInfo: any }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const { event } = eventInfo;
  const { extendedProps } = event._def;
  return (
    <>
      {!!Object.keys(extendedProps).length ? (
        <div
          onMouseEnter={() => setPopoverVisible(true)}
          onMouseLeave={() => {
            setPopoverVisible(false);
          }}
          className="overflow-hidden"
        >
          <p className="font-medium">
            {extendedProps?.ST} - {extendedProps?.ET}
          </p>
          <p className="font-medium">
            Court - {extendedProps?.court?.courtName}
          </p>
          <p className="font-medium capitalize">
            Sport - {extendedProps?.sport}
          </p>
          <p className="font-medium">
            Booked By -{" "}
            <span className="font-bold capitalize">
              {extendedProps?.customer?.name}
            </span>
          </p>
          {/* Add your additional text or HTML here */}
        </div>
      ) : (
        <div>{eventInfo.timeText}</div>
      )}
    </>
  );
};

export default RenderEventContent;
