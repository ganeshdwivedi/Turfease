import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import moment from "moment";
import { Button, Card, Col, DatePicker, Popover, Row, Typography } from "antd";
import useGetAllCourts from "../../hooks/useGetAllCourts";
import useGetBookingsByDate from "../../hooks/useGetBookingsByDate";
import UserProfile from "../../components/UserProfile";
import EventPopover from "./EventPopover";
import dayjs from "dayjs";
import DateCarousel from "./DateCrousel";
import StatsCard from "./StatsCard";
import CreateBookingModal from "./CreateBookingModal";

const localizer = momentLocalizer(moment);
const switchBUtton = {
  cursor: "pointer",
  background: "white",
  boxShadow: "0px 4px 4px 0px #0000000D inset",
  borderRadius: "7px",
  padding: "5px",
  width: "70px",
  height: "36px",
};

let formats = {
  timeGutterFormat: "HH:mm",
};

const arrows = {
  // position: "absolute",
  top: "55%",
  zIndex: "99",
  cursor: "pointer",
  height: "60px",
  display: "block",
  background: "white",
  borderRadius: "4px",
  padding: "21px 2.2px",
  border: "1px solid #EEEFEE",
  color: "#22356D",
  boxShadow: "4px 4px 4px 0px #0000000D",
};

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPort, setViewPort] = useState("Laptop");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [visibleCourts, setVisibleCourts] = useState([0, 4]);
  const [event, setEvent] = useState(null);
  const [search, setSearch] = useState(""); // customer search in create modal
  const {
    isSuccess,
    data: BookingData,
    isError,
  } = useGetBookingsByDate({ selectedDate });

  const {
    isSuccess: CourtsSuccess,
    data: CourtsData,
    isError: CourtsError,
    refetch: CourtsREfetch,
  } = useGetAllCourts();
  const totalCourts = CourtsData?.length || 0;

  const CustomEvent = ({ event }: { event: any }) => {
    return (
      <Popover
        classNames={{ body: "!p-0" }}
        content={<EventPopover event={event} />}
      >
        <div>
          <strong>
            {event.court?.courtName} - ({event?.sport})
          </strong>
          <UserProfile user={event?.customer} />
        </div>
      </Popover>
    );
  };

  const handleClickOpen = (newEvent: any) => {
    setIsModalOpen(true);
    setEvent(newEvent);
  };

  const eventPropGetter = useCallback((event: any, start: any, end: any) => {
    const isPaymentPending = event?.payment?.remainingAmount !== 0;
    return {
      ...(!event.IsApproved && {
        className: "",
        style: {
          backgroundColor: "#00A0DF1F", // blue
          right: 0,
          border: "#00A0DF 0.5px solid",
          borderLeft: isPaymentPending ? "#C11F22 5px solid" : "",
          color: "#00A0DF",
        },
      }),
      ...(event.IsApproved && {
        className: "",
        style: {
          backgroundColor: "#1FC13433", // blue
          right: 0,
          border: "#1FC134 0.5px solid",
          borderLeft: isPaymentPending ? "#C11F22 5px solid" : "",
          color: "#1FC134",
        },
      }),
      ...(event.isCanceled && {
        className: "",
        style: {
          backgroundColor: "#C11F2233", // blue
          right: 0,
          border: "#C11F22 0.5px solid",
          borderLeft: "#C11F22 0.5px solid",
          color: "#C11F22",
        },
      }),
    };
  }, []);

  const handleEvent = (events: any) => {
    console.log(events, "eventntntnntntnt----");
  };

  // for showing the active line only if current day
  const elements = document.querySelectorAll(".rbc-current-time-indicator");
  const label = document.querySelectorAll(".rbc-label");

  useEffect(() => {
    const today = new Date();
    const isToday =
      moment(selectedDate).format("DD/MM/YY") ===
      moment(today).format("DD/MM/YY");
    if (elements?.length > 0 && !isToday) {
      elements.forEach(function (element) {
        element.classList.add("hiddencalRow");
      });
    } else {
      elements.forEach(function (element) {
        element.classList.remove("hiddencalRow");
      });
    }
  }, [selectedDate, elements]);

  const handleNext = () => {
    const [start, end] = visibleCourts;
    let step;

    switch (viewPort) {
      case "Mobile":
        step = 1;
        break;
      case "Tablet":
        step = 3;
        break;
      case "Large":
        step = 5;
        break;
      default:
        step = 1;
    }

    const newStart = Math.min(start + step, totalCourts - step);
    const newEnd = Math.min(end + step, totalCourts);

    if (newStart < totalCourts) {
      setVisibleCourts([newStart, newEnd]);
    }
  };

  const handlePrev = () => {
    const [start, end] = visibleCourts;
    let step;

    switch (viewPort) {
      case "Mobile":
        step = 1;
        break;
      case "Tablet":
        step = 3;
        break;
      case "Large":
        step = 5;
        break;
      default:
        step = 1;
    }

    const newStart = Math.max(start - step, 0);
    const newEnd = Math.max(end - step, step);

    if (newStart >= 0) {
      setVisibleCourts([newStart, newEnd]);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(max-width: 600px)").matches) {
        setViewPort("Mobile");
        setVisibleCourts([0, 1]);
      } else if (window.matchMedia("(max-width: 1050px)").matches) {
        setViewPort("Tablet");
        setVisibleCourts([0, 3]);
      } else if (window.matchMedia("(max-width: 1450px)").matches) {
        setViewPort("Large");
        setVisibleCourts([0, 4]);
      } else {
        setViewPort("Laptop");
        setVisibleCourts([0, 5]);
      }
    };

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={12}>
          <DatePicker
            allowClear={false}
            format={"DD MMMM YYYY"}
            size="large"
            className="!mb-5 !bg-gray-100 !border-none font-semibold !text-xl"
            value={dayjs(selectedDate)}
            onChange={(date) => setSelectedDate(dayjs(date).toDate())}
          />
          <DateCarousel
            value={dayjs(selectedDate)}
            onChange={(date: any) => setSelectedDate(date)}
          />
        </Col>
        <Col sm={24} md={12}>
          <StatsCard selectedDate={selectedDate} />
        </Col>
      </Row>
      <div className="bg-white p-5 rounded-lg shadow-lg mt-5">
        <div
          style={
            {
              width: "100%",
              position: "relative",
              marginBottom: "20px",
            } as React.CSSProperties
          }
        >
          {/* arrow for mobile view only */}
          <div className="flex flex-row justify-between items-center mb-4">
            <div>
              {visibleCourts[0] > 0 && (
                <Button
                  icon={<SlArrowLeft style={{ color: "#22356D" }} />}
                  onClick={handlePrev}
                />
              )}
            </div>

            <div>
              {visibleCourts[1] < totalCourts && (
                <Button
                  icon={<SlArrowRight style={{ color: "#22356D" }} />}
                  onClick={handleNext}
                ></Button>
              )}
            </div>
          </div>
          {/* ---- ends here ---- */}
          <Calendar
            className="rbc-calendar-page"
            dayLayoutAlgorithm={"no-overlap"}
            //   backgroundEvents={filteredArray}
            date={dayjs(selectedDate).toDate()}
            defaultView={Views.DAY}
            events={BookingData}
            localizer={localizer}
            formats={formats}
            resourceIdAccessor="_id"
            resourceAccessor="courtID"
            startAccessor="startTime"
            endAccessor="endTime"
            min={new Date(2025, 8, 4, 0, 0, 0)}
            max={new Date(2025, 8, 4, 23, 59, 59)}
            resources={CourtsData?.slice(visibleCourts[0], visibleCourts[1])}
            resourceTitleAccessor={(resource: any) => {
              return (
                <div>
                  <Typography.Title level={3}>
                    {resource.courtName}
                  </Typography.Title>
                  <Typography.Text>
                    &nbsp;
                    {resource?.sportsAvailable
                      ?.map((item: string) => item)
                      .join(", ")}
                  </Typography.Text>
                </div>
              );
            }}
            step={30}
            selectable
            onSelectSlot={handleClickOpen}
            onSelectEvent={handleEvent}
            eventPropGetter={eventPropGetter}
            components={{
              event: CustomEvent,
            }}
            views={{ day: true, week: false, month: false }}
            style={{ height: "100%" }}
          />
        </div>

        {/*Loading */}
        {/* {EventLoading && (
        <Box
          position={"absolute"}
          top={60}
          left={40}
          sx={{
            width: { xs: "90%", sm: "97.5%" },
            height: { xs: "95%", sm: "99%" },
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.10)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            style={{ borderRadius: "7px", width: "40px", height: "40px" }}
            src="/images/Loadingic.gif"
          />
        </Box>
      )} */}

        {isModalOpen && (
          <CreateBookingModal
            event={event}
            isOpen={isModalOpen}
            onOpenChange={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </Fragment>
  );
}

CalendarPage.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
  dayLayoutAlgorithm: PropTypes.string,
};
