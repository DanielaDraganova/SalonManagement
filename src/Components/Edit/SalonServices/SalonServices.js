import { useState } from "react";
import { useParams } from "react-router-dom";

import { addNewServiceInDB } from "../../../firebase";
import Modal from "react-modal";
Modal.setAppElement("#root");
//import Modal from "react-bootstrap/Modal";
import {
  getOneSalon,
  getImageUrls,
  deleteServiceInDB,
} from "../../../firebase";
import Accordion from "react-bootstrap/Accordion";

//import styles from "../Edit.module.css";
import stylesServices from "./SalonServices.module.css";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export const SalonService = ({ services, setServices }) => {
  const params = useParams();
  const salonId = params.salonId;

  const [serviceInput, setServiceInput] = useState({
    service: "",
    staffCount: "",
    serviceDescription: "",
    price: "",
  });

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const [serviceInputErr, setServiceInputErr] = useState({
    service: "",
    staffCount: "",
    serviceDescription: "",
    price: "",
  });

  const onServiceInputChange = (e) => {
    const { name, value } = e.target;
    setServiceInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateServiceInput(e);
  };

  const validateServiceInput = (e) => {
    let { name, value } = e.target;
    setServiceInputErr((prev) => {
      const stateObj = { ...prev, [name]: "" };
      switch (name) {
        case "service":
          if (!value) {
            stateObj[name] = "Please enter Type of Service.";
          }
          if (services.map((s) => s.service).includes(value)) {
            stateObj[name] = "Service already exists.";
          }
          break;

        case "staffCount":
          if (!value) {
            stateObj[name] = "Please enter Staff Count.";
          }
          break;

        case "price":
          if (!value) {
            stateObj[name] = "Please enter Price.";
          }
          break;

        case "serviceDescription":
          if (!value) {
            stateObj[name] = "Please enter Service description.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  const addServiceHandler = async (e) => {
    e.preventDefault();

    let valid = true;
    Object.values(serviceInputErr).forEach((e) => {
      if (e.length != 0) {
        valid = false;
      }
    });
    if (!valid) {
      alert("Invalid input");
    } else {
      await addNewServiceInDB(salonId, { ...serviceInput });
      setServices((prevState) => [...prevState, serviceInput]);
      closeModal();
    }
  };

  const deleteServiceHandler = async (service) => {
    await deleteServiceInDB(salonId, service);
    console.log();

    setServices(services.filter((s) => s !== service));
  };
  return (
    <div className={stylesServices["services__container"]}>
      <Accordion flush>
        {services.map((s) => (
          <Accordion.Item
            style={{ width: "300px" }}
            key={s.service}
            eventKey={s.service}
          >
            <Accordion.Header>{s.service}</Accordion.Header>
            <Accordion.Body
              style={{
                color: "#5d4954",
              }}
            >
              <strong>Description: </strong>
              <span
                style={{
                  wordBreak: "break-all",
                }}
              >
                {s.serviceDescription}{" "}
              </span>
              <hr />
              <strong> Staff Count: </strong>
              <span>{s.staffCount}</span>
              <hr />
              <strong> Price: </strong>
              <span>{s.price}</span>
              <hr />
              <button
                style={{
                  textAlign: "center",
                  fontSize: "large",
                  padding: "0",
                  border: "none",
                  color: "red",
                  background: "none",
                }}
                onClick={() => deleteServiceHandler(s)}
              >
                DELETE
              </button>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button className={stylesServices["close-btn"]} onClick={closeModal}>
          x
        </button>

        <form onSubmit={addServiceHandler}>
          <div className={stylesServices["modal__container"]}>
            <label htmlFor="service" className={stylesServices.label}>
              Type of service
            </label>
            <input
              required
              id="service"
              type="text"
              name="service"
              className={stylesServices["modal__textBox"]}
              value={serviceInput.service}
              placeholder="Enter type of service"
              onChange={onServiceInputChange}
              onBlur={validateServiceInput}
            />
            {serviceInputErr.service && (
              <span className={stylesServices.err}>
                {serviceInputErr.service}
              </span>
            )}

            <label htmlFor="staffCount" className={stylesServices.label}>
              Staff Count
            </label>
            <input
              required
              id="staffCount"
              type="number"
              name="staffCount"
              className={stylesServices["modal__textBox"]}
              value={serviceInput.staffCount}
              placeholder="Enter staff count"
              onChange={onServiceInputChange}
              onBlur={validateServiceInput}
            />
            {serviceInputErr.staffCount && (
              <span className={stylesServices.err}>
                {serviceInputErr.staffCount}
              </span>
            )}

            <label
              htmlFor="serviceDescription"
              className={stylesServices.label}
            >
              Service Description
            </label>
            <input
              required
              maxLength={200}
              id="serviceDescription"
              type="text"
              name="serviceDescription"
              className={stylesServices["modal__textBox"]}
              value={serviceInput.serviceDescription}
              placeholder="Enter description of the service"
              onChange={onServiceInputChange}
              onBlur={validateServiceInput}
            />
            {serviceInputErr.serviceDescription && (
              <span className={stylesServices.err}>
                {serviceInputErr.serviceDescription}
              </span>
            )}

            <label htmlFor="staffCount" className={stylesServices.label}>
              Price
            </label>
            <input
              required
              id="price"
              type="number"
              name="price"
              className={stylesServices["modal__textBox"]}
              value={serviceInput.price}
              placeholder="Enter service price"
              onChange={onServiceInputChange}
              onBlur={validateServiceInput}
            />
            {serviceInputErr.price && (
              <span className={stylesServices.err}>
                {serviceInputErr.price}
              </span>
            )}

            <button type="submit" className={stylesServices["modal__btn"]}>
              Submit
            </button>
          </div>
        </form>
      </Modal>
      <button className={stylesServices["addService__btn"]} onClick={openModal}>
        Add new service
      </button>
    </div>
  );
};
