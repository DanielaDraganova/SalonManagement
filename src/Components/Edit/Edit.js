import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, editSalonInDB, getOneSalon, getImageUrls } from "../../firebase";

import Modal from "react-modal";
Modal.setAppElement("#root");
import TimePicker from "react-time-picker";

import styles from "./Edit.module.css";
import { SalonService } from "./SalonServices/SalonServices";

export const Edit = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const params = useParams();
  const salonId = params.salonId;

  const [input, setInput] = useState({
    salonName: "",
    managerName: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
  });

  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");

  const [services, setServices] = useState([]);

  useEffect(() => {
    async function getOne() {
      const salonRes = await getOneSalon(salonId);

      const imageUrls = await getImageUrls(salonRes.imageIds);
      salonRes.imageUrls = imageUrls;
      console.log("SALON RES:");
      console.log(salonRes.services);
      setServices(salonRes.services);
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

  const validateTime = () => {
    if (startTime == null || endTime == null) {
      return "Enter opening and closing time";
    }
    return "";
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setErr((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "salonName":
          if (!value) {
            stateObj[name] = "Please enter Salon Name.";
          }
          break;

        case "managerName":
          if (!value) {
            stateObj[name] = "Please enter Manager Name.";
          }
          break;

        case "description":
          if (!value) {
            stateObj[name] = "Please enter description.";
          }
          break;

        case "location":
          if (!value) {
            stateObj[name] = "Please enter location.";
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
      await editSalonInDB(salonId, { ...input, startTime, endTime });
      navigate("/catalog");
    }
  };

  return (
    <Fragment>
      <div className={styles.tip}>
        <h2>
          These forms are designed for you to fill in everything customers need
          <br />
          to visit your salon.
        </h2>
      </div>
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
            {err.salonName && (
              <span className={styles.err}>{err.salonName}</span>
            )}

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
            {err.managerName && (
              <span className={styles.err}>{err.managerName}</span>
            )}

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
            {err.description && (
              <span className={styles.err}>{err.description}</span>
            )}

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
            {err.location && <span className={styles.err}>{err.location}</span>}

            <label htmlFor="startTime">Opening Time</label>
            <TimePicker
              disableClock={true}
              id="startTime"
              name="startTime"
              onChange={setStartTime}
              value={input.startTime}
            />
            <label htmlFor="endTime">Closing Time</label>
            <TimePicker
              disableClock={true}
              id="endTime"
              name="endTime"
              onChange={setEndTime}
              value={input.endTime}
            />

            <button type="submit" className={styles["edit__btn"]}>
              Edit Salon
            </button>
          </div>
        </form>
        <SalonService services={services} setServices={setServices} />
      </div>
    </Fragment>
  );
};
