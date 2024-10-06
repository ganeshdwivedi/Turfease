import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import DateCarousel from "../DateCrousel";
import CustomModal from "./CustomModal";
import AirDatepickerReact from "../../components/calendar/AirDatePicker";
import { getAllBookings, getAllCourts } from "../../api/Calendar";
import { Court } from "../../Types/Court";
import { Booking } from "../../Types/Booking";
import useGetBookingsByDate from "../../customHook/useGetBookingsByDate";
import useGetAllCourts from "../../customHook/useGetAllCourts";
import useGetAllCustomer from "../../customHook/useGetAllCustomer";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isSuccess, data, isError, refetch, setSelectedDate } =
    useGetBookingsByDate();
  const {
    isSuccess: CourtsSuccess,
    data: CourtsData,
    isError: CourtsError,
    refetch: CourtsREfetch,
  } = useGetAllCourts();
  const {
    isSuccess: CustomerSuccess,
    isError: CustomerError,
    data: CustomerData,
    refetch: CustomerRefetch,
  } = useGetAllCustomer();
  const calendarRef = useRef<FullCalendar>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [event, setEvent] = useState();
  const [AllCusotmer, setAllCustomer] = useState<any[]>([]);
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [eventData, setEventData] = useState({ title: "", start: "", end: "" });
  const [allCourt, setAllCourt] = useState<Court[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [hoveredEventEl, setHoveredEventEl] = useState(null);

  useEffect(() => {
    setSelectedDate(currentDate);
  }, [currentDate]);

  // get Courts
  useEffect(() => {
    if (CourtsSuccess) {
      const updatedData = CourtsData.map((item: Court) => {
        const { courtName, _id, ...newitem } = item;
        return { title: courtName, id: _id, ...newitem };
      });
      setAllCourt(updatedData);
    } else {
      setAllCourt([]);
    }
  }, [CourtsSuccess, CourtsData, CourtsError]);

  // get Bookings
  useEffect(() => {
    if (isSuccess) {
      const updatedData = data.map((item: Booking) => {
        const { bookingDate, startTime, user, court, endTime, ...newitem } =
          item;
        const bookDate = moment(bookingDate).format("YYYY-MM-DD");
        const start = moment(
          `${bookDate} ${startTime}`,
          "YYYY-MM-DD HH:ss"
        ).toDate();
        const end = moment(
          `${bookDate} ${endTime}`,
          "YYYY-MM-DD HH:ss"
        ).toDate();
        return {
          bookDate,
          start,
          end,
          ST: startTime,
          ET: endTime,
          resourceId: court._id,
          user,
          court,
          ...newitem,
        };
      });
      setAllBookings(updatedData);
    } else {
      setAllBookings([]);
    }
  }, [isSuccess, data, isError]);

  // get Bookings
  useEffect(() => {
    if (CustomerSuccess) {
      setAllCustomer(CustomerData);
    } else {
      setAllCustomer([]);
    }
  }, [CustomerData, CustomerError, CustomerSuccess]);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      // Custom function to change the date
      const changeDate = (newDate: Date) => {
        calendarApi.gotoDate(newDate); // Use FullCalendar's API to change the date
      };
      // Example usage
      changeDate(currentDate);
    }
  }, [currentDate]);

  const handleSelect = (event: any) => {
    setEvent(event);
    setIsOpen((prev: boolean) => !prev);
  };

  const handleEventMouseEnter = (info: any) => {
    setEventData({
      title: info.event.title,
      start: info.event.start.toLocaleTimeString(),
      end: info.event.end ? info.event.end.toLocaleTimeString() : "",
    });

    // Set the hovered element for triggering popover
    setHoveredEventEl(info.el);
    setPopoverVisible(true);
    // console.log(info, "infooenter");
    const eventElement = info.el;
    // Add custom hover styling
    eventElement.style.backgroundColor = "lightblue";
    eventElement.style.cursor = "pointer";
  };

  const handleEventMouseLeave = (info: any) => {
    const eventElement = info.el;
    // Reset the background color on mouse leave
    eventElement.style.backgroundColor = "";
  };

  function renderEventContent(eventInfo: any) {
    const { event } = eventInfo;
    const { extendedProps } = event._def;
    return (
      <>
        {!!Object.keys(extendedProps).length ? (
          <div className="">
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
                {extendedProps?.user?.name}
              </span>
            </p>
            {/* Add your additional text or HTML here */}
          </div>
        ) : (
          <div>{eventInfo.timeText}</div>
        )}
      </>
    );
  }

  const handleEventClick = (eventInfo: any) => {
    const { event } = eventInfo;
    const { extendedProps } = event._def;
    setEvent(extendedProps);
    setIsOpen(true);
  };

  return (
    <div className="calendar-container">
      <div className="flex flex-row justify-between items-center gap-5 mb-5">
        <AirDatepickerReact
          selectedDays={currentDate}
          setSelectedDate={setCurrentDate}
        />
        <div>
          <DateCarousel
            selectedDate={currentDate}
            setSelectedDate={setCurrentDate}
          />
        </div>
      </div>
      <div className="">
        <FullCalendar
          ref={calendarRef}
          plugins={[resourceTimeGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="resourceTimeGridDay"
          resources={allCourt}
          resourceAreaWidth="100%"
          height={1300}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          headerToolbar={{
            left: "",
            center: "",
            right: "",
          }}
          select={(event: any) => handleSelect(event)}
          eventClick={(event: any) => handleEventClick(event)}
          nowIndicator={true}
          eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={handleEventMouseLeave}
          events={allBookings}
          eventContent={(data: any) => renderEventContent(data)}
          // editable={true}
          selectable={true}
          slotDuration={30}
          selectMirror={true}
          allDaySlot={false}
        />

        <CustomModal
          updateBookings={refetch}
          AllCustomer={AllCusotmer}
          event={event}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
      </div>
    </div>
  );
};

/* <Popover
            isOpen={popoverVisible}
            onClose={() => setPopoverVisible(false)}
            placement="top"
          >
            <PopoverTrigger>
              {hoveredEventEl}
            </PopoverTrigger>
            <PopoverContent>
              <p>Title: {eventData.title}</p>
              <p>Start: {eventData.start}</p>
              <p>End: {eventData.end}</p>
            </PopoverContent>
          </Popover>
          */

export default CalendarPage;
