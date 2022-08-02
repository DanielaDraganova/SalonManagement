import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import styles from "./BookingCalendar.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Fragment, useState } from "react";

Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const BookingCalendar = ({ salon }) => {
  const today = new Date();

  const first = today.getDate() - today.getDay() + 1;

  const monday = new Date(today.setDate(first));

  const [currentMonday, setCurrentMonday] = useState(monday);

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
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button className={styles["btn-booking"]}>&#8592;</button>
      <Container fluid="true">
        <Row className={styles["calendar-row"]}>
          {[...Array(7).keys()]
            .map((day) => currentMonday.addDays(day))
            .map((day) => (
              <Col
                className={`${styles.calendar} ${styles["calendar-header"]}`}
              >
                {day.getDate() +
                  "." +
                  (day.getMonth() + 1) +
                  "." +
                  day.getFullYear()}
              </Col>
            ))}
        </Row>
        {[...Array(closingTime.getHours() - openingTime.getHours()).keys()].map(
          (hours) => (
            <Row className={styles["calendar-row"]}>
              {[...Array(7).keys()].map((hour) => (
                <Col className={styles.calendar}>
                  {openingTime.getHours() + hours + ":00"}
                </Col>
              ))}
            </Row>
          )
        )}
      </Container>

      <button>&#8594;</button>
    </div>
  );
};
export default BookingCalendar;
