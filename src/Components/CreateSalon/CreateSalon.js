import React, { useContext, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { auth, createSalonInDB, uploadFiles } from "../../firebase";

import styles from "./CreateSalon.module.css";

function CreateSalon() {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/catalog");
    }
  }, [user, isLoading]);

  const [input, setInput] = useState({
    salonName: "",
    managerName: "",
    description: "",
    location: "",
  });

  const [images, setImages] = useState([]);

  const [err, setErr] = useState({
    salonName: "",
    managerName: "",
    description: "",
    location: "",
  });
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
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

  const ref = useRef();

  const createSalonHandler = async (e) => {
    e.preventDefault();
    const imageIds = uploadFiles(images);
    console.log(imageIds);

    let valid = true;
    Object.values(err).forEach((e) => {
      if (e.length != 0) {
        valid = false;
      }
    });
    if (!valid) {
      console.log("NOT VALID");
    } else {
      console.log("BEFORE CREATE SALON");
      createSalonInDB({
        salonName: input.salonName,
        managerName: input.managerName,
        description: input.description,
        location: input.location,
        imageIds,
        services: [],
        owner: user.uid,
        startTime: "09:00",
        endTime: "18:00",
      }).then((err) => {
        if (err) {
          alert(err);
        }
        ref.current.value = "";
        setInput({
          salonName: "",
          managerName: "",
          description: "",
          location: "",
        });

        navigate("/catalog");
      });
    }
  };

  const validateAll = () => {};
  return (
    <div className={styles.create}>
      <form onSubmit={createSalonHandler}>
        <div className={styles["create__container"]}>
          <label htmlFor="salonName">Salon Name</label>
          <input
            required
            id="salonName"
            type="text"
            name="salonName"
            className={styles["create__textBox"]}
            value={input.salonName}
            placeholder="Salon Name"
            onChange={onInputChange}
            onBlur={validateInput}
          />
          {err.salonName && <span className={styles.err}>{err.salonName}</span>}

          <label htmlFor="managerName">Manager Full Name</label>
          <input
            required
            id="managerName"
            type="text"
            name="managerName"
            className={styles["create__textBox"]}
            value={input.managerName}
            placeholder="Full Name"
            onChange={onInputChange}
            onBlur={validateInput}
          />
          {err.managerName && (
            <span className={styles.err}>{err.managerName}</span>
          )}

          <label htmlFor="desc">Description</label>
          <textarea
            required
            id="desc"
            type="text"
            name="description"
            maxlength={90}
            className={styles["create__textBox"]}
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
            className={styles["create__textBox"]}
            value={input.location}
            placeholder="Location"
            onChange={onInputChange}
            onBlur={validateInput}
          />
          {err.description && (
            <span className={styles.err}>{err.description}</span>
          )}

          <label htmlFor="salonImages">Choose salon images</label>
          <input
            required
            id="salonImages"
            type="file"
            multiple
            ref={ref}
            onChange={(e) => setImages(e.target.files)}
          />

          <button
            type="submit"
            onClick={validateAll}
            className={styles["create__btn"]}
          >
            Create Salon
          </button>
        </div>
      </form>
    </div>
  );
}
export default CreateSalon;
