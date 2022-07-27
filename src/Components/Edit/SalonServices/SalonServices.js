import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, addNewServiceInDB } from "../../../firebase";
import Modal from "react-modal";
Modal.setAppElement("#root");
import { getOneSalon, getImageUrls } from "../../../firebase";

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
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const [serviceInput, setServiceInput] = useState({
    service: "",
    staffCount: "",
    serviceDescription: "",
  });

  //   const [services, setServices] = useState(inputServices);
  console.log("SalonService:");
  console.log(services);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/catalog");
  }, [user, loading]);

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
          break;

        case "staffCount":
          if (!value) {
            stateObj[name] = "Please enter Staff Count.";
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
  return (
    <div className={stylesServices["services__container"]}>
      <form>
        <div className={stylesServices.title}>SERVICES</div>
        <div>
          <p>You already do not have any services</p>
        </div>
      </form>

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
              <span className={styles.err}>{serviceInputErr.service}</span>
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
              <span className={styles.err}>{serviceInputErr.staffCount}</span>
            )}

            <label
              htmlFor="serviceDescription"
              className={stylesServices.label}
            >
              Service Description
            </label>
            <input
              required
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
              <span className={styles.err}>{serviceInputErr.description}</span>
            )}

            <button type="submit" className={stylesServices["modal__btn"]}>
              Submit
            </button>
          </div>
        </form>
      </Modal>
      {services.map((s) => (
        <div>
          <span className={stylesServices.spanLabel}> Service: </span>
          <span className={stylesServices.spanContent}>{s.service}, </span>
          <span className={stylesServices.spanLabel}>
            Service Description:{" "}
          </span>
          <span className={stylesServices.spanContent}>
            {s.serviceDescription},{" "}
          </span>
          <span className={stylesServices.spanLabel}>Staff Count: </span>
          <span className={stylesServices.spanContent}>{s.staffCount} </span>
        </div>
      ))}
      <button className={stylesServices["addService__btn"]} onClick={openModal}>
        Add new service
      </button>
    </div>
  );
};
