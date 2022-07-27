import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, editSalonInDB } from "../../firebase";
import Modal from "react-modal";
Modal.setAppElement("#root");
import { getOneSalon, getImageUrls } from "../../firebase";

import styles from "./Edit.module.css";

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

export const Edit = () => {
  const params = useParams();
  const salonId = params.salonId;

  const [input, setInput] = useState({
    salonName: "",
    managerName: "",
    description: "",
    location: "",
    services: [],
  });

  const [serviceInput, setServiceInput] = useState({
    service: "",
    staffCount: "",
    serviceDescription: "",
  });

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  useEffect(() => {
    async function getOne() {
      const salonRes = await getOneSalon(salonId);

      const imageUrls = await getImageUrls(salonRes.imageIds);
      salonRes.imageUrls = imageUrls;
      console.log("SALON RES:");
      console.log(salonRes);

      setInput({
        salonName: salonRes.salonName,
        managerName: salonRes.managerName,
        description: salonRes.description,
        location: salonRes.location,
      });
    }
    getOne();
  }, []);

  const [err, setErr] = useState({
    email: "",
    password: "",
  });

  const [serviceInputErr, setServiceInputErr] = useState({
    service: "",
    staffCount: "",
    serviceDescription: "",
  });
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };

  const onServiceInputChange = (e) => {
    const { name, value } = e.target;
    setServiceInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/catalog");
  }, [user, loading]);

  const validateServiceInput = (e) => {
    let { name, value } = e.target;
    setErr((prev) => {
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

  const validateInput = (e) => {
    let { name, value } = e.target;
    setErr((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "email":
          const pattern =
            /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
          if (!value) {
            stateObj[name] = "Please enter your Email.";
          } else {
            const result = pattern.test(value);
            if (result === false) {
              stateObj[name] = "Invalid Email";
            }
          }

        case "password":
          if (!value) {
            stateObj[name] = "Please enter your Password.";
          }
          break;

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

  const editSalon = async (e) => {
    e.preventDefault();
    console.log("in edit handler");

    let valid = true;
    Object.values(err).forEach((e) => {
      if (e.length != 0) {
        valid = false;
        console.log(e);
      }
    });
    if (!valid) {
      alert("Invalid input");
    } else {
      await editSalonInDB(salonId, { ...input });
      navigate("/catalog");
    }
  };

  //     const [openingTime, setOpeningTime] = useState("");
  //     const [closingTime, setClosingTime] = useState("");
  //     const [services, setServices] = useState("");
  //     const [team, setTeam] = useState("");
  return (
    <div className={styles.edit}>
      <form onSubmit={editSalon}>
        <div className={styles["edit__container"]}>
          <div className={styles.title}>Basic Information</div>
          <label htmlFor="salonName">Salon Name</label>
          <input
            required
            id="salonName"
            type="text"
            name="salonName"
            className={styles["edit__textBox"]}
            value={input.salonName}
            placeholder="Salon Name"
            onChange={onInputChange}
            onBlur={validateInput}
          />

          <label htmlFor="managerName">Manager Full Name</label>
          <input
            required
            id="managerName"
            type="text"
            name="managerName"
            className={styles["edit__textBox"]}
            value={input.managerName}
            placeholder="Full Name"
            onChange={onInputChange}
            onBlur={validateInput}
          />

          <label htmlFor="desc">Description</label>
          <input
            required
            id="desc"
            type="text"
            name="description"
            className={styles["edit__textBox"]}
            value={input.description}
            placeholder="Description"
            onChange={onInputChange}
            onBlur={validateInput}
          />

          <label htmlFor="location">Location</label>
          <input
            required
            id="location"
            type="text"
            name="location"
            className={styles["edit__textBox"]}
            value={input.location}
            placeholder="Location"
            onChange={onInputChange}
            onBlur={validateInput}
          />

          <button type="submit" className={styles["edit__btn"]}>
            Edit Salon
          </button>
        </div>
      </form>

      <div className={styles["edit__container"]}>
        <form action="">
          <div className={styles.title}>SERVICES</div>
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
          <button className={styles["close-btn"]} onClick={closeModal}>
            x
          </button>

          <form>
            <div className={styles["modal__container"]}>
              <label htmlFor="service" className={styles.label}>
                Type of service
              </label>
              <input
                required
                id="service"
                type="text"
                name="service"
                className={styles["modal__textBox"]}
                value={serviceInput.service}
                placeholder="Enter type of service"
                onChange={onServiceInputChange}
                onBlur={validateServiceInput}
              />
              {serviceInputErr.service && (
                <span className={styles.err}>{serviceInputErr.service}</span>
              )}

              <label htmlFor="staffCount" className={styles.label}>
                Staff Count
              </label>
              <input
                required
                id="staffCount"
                type="number"
                name="staffCount"
                className={styles["modal__textBox"]}
                value={serviceInput.staffCount}
                placeholder="Enter staff count"
                onChange={onServiceInputChange}
                onBlur={validateServiceInput}
              />
              {serviceInputErr.staffCount && (
                <span className={styles.err}>{serviceInputErr.staffCount}</span>
              )}

              <label htmlFor="serviceDescription" className={styles.label}>
                Service Description
              </label>
              <input
                required
                id="serviceDescription"
                type="text"
                name="serviceDescription"
                className={styles["modal__textBox"]}
                value={serviceInput.serviceDescription}
                placeholder="Enter description of the service"
                onChange={onServiceInputChange}
                onBlur={validateServiceInput}
              />
              {serviceInputErr.serviceDescription && (
                <span className={styles.err}>
                  {serviceInputErr.description}
                </span>
              )}

              <button type="submit" className={styles["modal__btn"]}>
                Login
              </button>
            </div>
          </form>
        </Modal>

        <button className={styles["edit__btn"]} onClick={openModal}>
          Add new service
        </button>
      </div>
    </div>
  );
};
