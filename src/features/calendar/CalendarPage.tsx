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
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import PopoverEvent from "../../components/calendar/PopoverEvent";
import RenderEventContent from "../../components/calendar/RenderEvents";

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
  const [allCourt, setAllCourt] = useState<Court[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [min, setMin] = useState<string>("08:00:00");
  const [max, setMax] = useState<string>("10:00:00");

  const handleEventClick = (eventInfo: any) => {
    const { event } = eventInfo;
    const { extendedProps } = event._def;
    setEvent(extendedProps);
    setIsOpen(true);
  };

  const handleSelect = (event: any) => {
    setEvent(event);
    setIsOpen((prev: boolean) => !prev);
  };

  useEffect(() => {
    setSelectedDate(currentDate);
  }, [currentDate]);

  // get Courts
  useEffect(() => {
    if (CourtsSuccess) {
      const updatedData = CourtsData.map((item: Court) => {
        const { courtName, _id, address, ...newitem } = item;
        return { title: courtName, id: _id, description: address, ...newitem };
      });

      let latestEndTime: string = "22:00";
      let latestStartTime: string = "08:00";
      CourtsData.forEach((court: Court) => {
        const start_time = court.workingHours.start;
        const end_time = court.workingHours.end;

        if (start_time < latestStartTime) {
          latestStartTime = start_time;
        }

        if (end_time > latestEndTime) {
          latestEndTime = end_time;
        }
      });

      setMin(latestStartTime);
      setMax(latestEndTime);
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

  const HedaererCustom = (e: any) => {
    return <p>hellooo</p>;
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
          resourceAreaHeaderContent={(e: any) => HedaererCustom(e)}
          // height={1300}
          slotMinTime={`${min}:00`}
          slotMaxTime={`${max}:00`}
          headerToolbar={{
            left: "",
            center: "",
            right: "",
          }}
          select={(event: any) => handleSelect(event)}
          eventClick={(event: any) => handleEventClick(event)}
          nowIndicator={true}
          events={allBookings}
          eventContent={(event: any) => {
            return <RenderEventContent eventInfo={event} />;
          }}
          // editable={true}
          selectable={true}
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
export default CalendarPage;
