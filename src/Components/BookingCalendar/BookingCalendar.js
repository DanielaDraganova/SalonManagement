import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import styles from "./BookingCalendar.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { createBookingInDB, getSalonBookings } from "../../firebase";

import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../contexts/LoadingContext";

Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const BookingCalendar = ({ salonId, salon, service }) => {
  const { showSpinner, hideSpinner } = useContext(LoadingContext);

  const { user } = useContext(AuthContext);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currBooking, setCurrBooking] = useState({});
  const [salonBookings, setSalonBookings] = useState([]);

  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = () => setShowConfirmation(true);

  const today = new Date();

  const first = today.getDate() - today.getDay() + 1;

  const monday = new Date(today.setDate(first));

  const [currentMonday, setCurrentMonday] = useState(monday);

  useEffect(() => {
    showSpinner();

    const fetchData = async () => {
      let bookings = await getSalonBookings(salonId, service);
      setSalonBookings(bookings);
      hideSpinner();
    };
    fetchData();
  }, []);

  const openingTime = new Date();
  const closingTime = new Date();

  openingTime.setHours(
    salon.startTime.split(":")[0],
    salon.startTime.split(":")[1],
    0,
    0
  );

  closingTime.setHours(
    salon.endTime.split(":")[0],
    salon.endTime.split(":")[1],
    0,
    0
  );
  const makeBookingHandler = async () => {
    await createBookingInDB({
      salonId: salonId,
      userId: user.uid,
      service: service.service,
      date: currBooking.time,
    });

    let bookings = await getSalonBookings(salonId, service);
    setSalonBookings(bookings);

    handleCloseConfirmation();
  };
  function showBookingConfirmation(day, hours) {
    const bookingDay = currentMonday.addDays(day);
    bookingDay.setHours(
      openingTime.getHours() + hours,
      openingTime.getMinutes(),
      0,
      0
    );
    setCurrBooking({
      time: bookingDay,
      service: service,
    });
    handleShowConfirmation();
  }

  function isSlotAvailable(day, hours) {
    const bookingDay = currentMonday.addDays(day);

    bookingDay.setHours(
      openingTime.getHours() + hours,
      openingTime.getMinutes(),
      0,
      0
    );
    let bookingsInSlot = 0;
    let staffCount = service.staffCount;

    salonBookings.forEach((booking) => {
      if (bookingDay.toISOString() == booking.date.toDate().toISOString()) {
        bookingsInSlot++;
      }
    });
    const isInThePast = bookingDay.getTime() < new Date().getTime();
    if (bookingsInSlot >= staffCount || isInThePast) {
      return false;
    } else {
      return true;
    }
  }

  function isAlreadyBooked(day, hours) {
    const bookingDay = currentMonday.addDays(day);
    bookingDay.setHours(
      openingTime.getHours() + hours,
      openingTime.getMinutes(),
      0,
      0
    );
    let alreadyBooked = false;

    salonBookings.forEach((booking) => {
      if (
        bookingDay.toISOString() == booking.date.toDate().toISOString() &&
        booking.userId == user.uid
      ) {
        alreadyBooked = true;
      }
    });
    return alreadyBooked;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={() => {
          setCurrentMonday(currentMonday.addDays(-7));
        }}
        style={{ margin: "10px" }}
      >
        &#8592;
      </button>

      <Container fluid>
        <Row className={`${styles["calendar-row"]}`}>
          {[...Array(7).keys()]
            .map((day) => currentMonday.addDays(day))
            .map((day) => (
              <Col
                key={day}
                className={`${styles.slot} ${styles["calendar-header"]}`}
              >
                {day.getDate()}
                <br />

                {day.toLocaleString("default", { month: "short" })}
              </Col>
            ))}
        </Row>
        {[...Array(closingTime.getHours() - openingTime.getHours()).keys()].map(
          (hours) => (
            <Row key={"hours_" + hours} className={styles["calendar-row"]}>
              {[...Array(7).keys()].map((day) => (
                <Col
                  key={"hours_" + hours + "_" + day}
                  onClick={() => {
                    if (isAlreadyBooked(day, hours)) {
                      alert("You already booked");
                    } else {
                      isSlotAvailable(day, hours)
                        ? showBookingConfirmation(day, hours)
                        : alert("Cannot book. This slot is not available");
                    }
                  }}
                  className={`${styles.slot} ${
                    isSlotAvailable(day, hours) ? "" : styles["disabled-slot"]
                  } ${
                    isAlreadyBooked(day, hours)
                      ? styles["already-booked-slot"]
                      : ""
                  }`}
                >
                  {openingTime.getHours() +
                    hours +
                    ":" +
                    (openingTime.getMinutes() < 10 ? "0" : "") +
                    openingTime.getMinutes()}
                </Col>
              ))}
            </Row>
          )
        )}
      </Container>

      <button
        onClick={() => {
          setCurrentMonday(currentMonday.addDays(7));
        }}
        style={{ margin: "10px" }}
      >
        &#8594;
      </button>

      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to book appointment for {service.service} at{" "}
          {currBooking.time?.getHours()}:
          {currBooking.time?.getMinutes() < 10 ? "0" : ""}
          {currBooking.time?.getMinutes()} on {currBooking.time?.getDate()}{" "}
          {currBooking.time?.toLocaleString("default", { month: "short" })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Close
          </Button>
          <Button onClick={makeBookingHandler} variant="primary">
            Book
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default BookingCalendar;
