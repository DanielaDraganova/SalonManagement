import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, editSalon } from "../../firebase";
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
  const [salon, setSalon] = useState("");
  const [input, setInput] = useState({
    salonName: "",
    managerName: "",
    description: "",
    location: "",
    services: [],
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
      setSalon(salonRes);
      console.log("SALON RES:");
      console.log(salonRes);
      setInput({
        salonName: salon.salonName,
        managerName: salon.managerName,
        description: salon.description,
        location: salon.location,
      });
    }
    getOne();
  }, []);
  console.log(salon);

  const [err, setErr] = useState({
    email: "",
    password: "",
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
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/catalog");
  }, [user, loading]);

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

        default:
          break;
      }

      return stateObj;
    });
  };

  const editSalon = (e) => {
    e.preventDefault();

    let valid = true;
    Object.values(err).forEach((e) => {
      if (e.length != 0) {
        valid = false;
      }
    });
    if (!valid) {
    } else {
      editSalon({ ...input });
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
          {/* <button onClick={closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form> */}
        </Modal>

        <button className={styles["edit__btn"]} onClick={openModal}>
          Add new service
        </button>
      </div>
    </div>
  );
};
