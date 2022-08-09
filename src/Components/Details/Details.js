import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOneSalon, getImageUrls, deleteSalon } from "../../firebase";
import BookingCalendar from "../BookingCalendar/BookingCalendar";

import styles from "./Details.module.css";

import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";

import Modal from "react-bootstrap/Modal";
import { LoadingContext } from "../../contexts/LoadingContext";
import { AuthContext } from "../../contexts/AuthContext";

const Details = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  console.log(user);
  const params = useParams();
  const salonId = params.salonId;
  const [salon, setSalon] = useState("");

  const { showSpinner, hideSpinner, isLoading } = useContext(LoadingContext);

  const [modalShow, setModalShow] = useState(false);
  const [serviceModalShow, setServiceModalShow] = useState(false);
  const [serviceForBooking, setServiceForBooking] = useState({
    service: "",
    staffCount: "",
    serviceDescription: "",
  });

  const [serviceDetails, setSeviceDetails] = useState({
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

  async function deleteSalonHanfler() {
    if (confirm("Are you sure you want to delete this salon?")) {
      const err = await deleteSalon(salonId);
      if (err) {
        alert(err);
      } else {
        navigate("/catalog");
      }
    }
  }

  return (
    <div className={styles.container}>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={serviceModalShow}
        onHide={() => setServiceModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title
            style={{ fontFamily: "Poppins", fontWight: "bold" }}
            id="contained-modal-title-vcenter"
          >
            {serviceDetails.service}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            paddingLeft: "0",
            paddingRight: "0",
          }}
        >
          <div className={styles["service-details"]}>
            <div>{serviceDetails.serviceDescription}</div>
            <hr />
            <div style={{ fontStyle: "italic", fontWeight: "bold" }}>
              Price: {serviceDetails.price}
            </div>
          </div>
        </Modal.Body>
      </Modal>
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
              style={{
                width: "18rem",
                display: "inline-block",
                margin: "30px",
              }}
              className="mb-2"
            >
              <Card.Header style={{ fontSize: "20px" }}>
                {service.service}
              </Card.Header>

              <Card.Body>
                {user ? (
                  <button
                    style={{
                      borderRadius: "30%",
                      textAlign: "center",
                      padding: "5px",
                      margin: "5px",
                      background: "#5d4954",
                      color: "white",
                    }}
                    onClick={() => {
                      setServiceForBooking(service);
                      setModalShow(true);
                    }}
                  >
                    Book
                  </button>
                ) : (
                  ""
                )}

                <button
                  style={{
                    borderRadius: "20%",
                    textAlign: "center",
                    padding: "5px",
                    margin: "5px",
                    background: "#5d4954",
                    color: "white",
                  }}
                  onClick={() => {
                    setSeviceDetails(service);
                    setServiceModalShow(true);
                  }}
                >
                  Details
                </button>
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
          <a onClick={deleteSalonHanfler} className={styles.button}>
            Delete salon →
          </a>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Details;
