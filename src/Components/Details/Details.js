import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOneSalon, getImageUrls } from "../../firebase";
import BookingCalendar from "../BookingCalendar/BookingCalendar";

import styles from "./Details.module.css";

import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import { LoadingContext } from "../../contexts/LoadingContext";
import { AuthContext } from "../../contexts/AuthContext";

const Details = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  const params = useParams();
  const salonId = params.salonId;
  const [salon, setSalon] = useState("");

  const { showSpinner, hideSpinner, isLoading } = useContext(LoadingContext);

  const [modalShow, setModalShow] = useState(false);
  const [serviceForBooking, setServiceForBooking] = useState({
    service: "",
    staffCount: "",
    serviceDescription: "",
  });

  useEffect(() => {
    showSpinner();
    async function getOne() {
      const salonRes = await getOneSalon(salonId);

      const imageUrls = await getImageUrls(salonRes.imageIds);
      salonRes.imageUrls = imageUrls;
      console.log("IMAGE URLS");
      console.log(imageUrls);
      setSalon(salonRes);
      hideSpinner();
    }
    getOne();
  }, []);

  function isOwner() {
    let isOwner = false;

    if (user?.uid == salon?.owner) {
      isOwner = true;
    }

    return isOwner;
  }

  return (
    <div className={styles.container}>
      <Carousel>
        {salon.imageUrls
          ? salon.imageUrls.map((i) => (
              <Carousel.Item key={i}>
                <img
                  style={{
                    width: "900px",
                    height: "600px",
                  }}
                  src={i}
                  alt="salonImg"
                />
                <Carousel.Caption>
                  <h3>{salon.salonName}</h3>
                </Carousel.Caption>
              </Carousel.Item>
            ))
          : ""}
      </Carousel>

      {salon
        ? salon.services.map((service) => (
            <Card
              bg={"secondary"}
              key={service.service}
              text={"light"}
              style={{ width: "18rem" }}
              className="mb-2"
            >
              <Card.Header>{service.service}</Card.Header>
              <Card.Body>
                <Card.Text>{service.serviceDescription}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>Price:</ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Card.Link
                  onClick={() => {
                    setServiceForBooking(service);
                    setModalShow(true);
                  }}
                  href="#"
                >
                  Book
                </Card.Link>
              </Card.Body>
            </Card>
          ))
        : ""}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title
            style={{ fontFamily: "Poppins", fontWight: "bold" }}
            id="contained-modal-title-vcenter"
          >
            Make an appointment for {serviceForBooking.service}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingLeft: "0", paddingRight: "0" }}>
          <BookingCalendar
            salonId={salonId}
            salon={salon}
            service={serviceForBooking}
          />
        </Modal.Body>
      </Modal>
      {isLoading ? (
        ""
      ) : isOwner() ? (
        <div className={styles["button-container"]}>
          <a href={`/${salonId}/salon-edit`} className={styles.button}>
            Edit Salon →
          </a>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Details;
