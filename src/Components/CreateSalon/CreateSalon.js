import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, createSalonInDB, uploadFiles } from "../../firebase";

import styles from "../Register/Register.module.css";

function CreateSalon() {
  const [managerName, setManagerName] = useState("");
  const [description, setDescription] = useState("");
  const [salonName, setSalonName] = useState("");
  const [location, setLocation] = useState("");

  const [images, setImages] = useState([]);

  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const ref = useRef();

  const createSalonHandler = () => {
    if (!managerName) alert("Please enter name");
    const imageIds = uploadFiles(images);

    createSalonInDB({
      salonName,
      managerName,
      description,
      location,
      imageIds,
    }).then(() => {
      ref.current.value = "";

      setManagerName("");
      setDescription("");
      setSalonName("");
      setLocation("");

      navigate("/catalog");
    });
  };
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className={styles.register}>
      <div className={styles["register__container"]}>
        <label>Salon Name</label>
        <input
          type="text"
          className={styles["register__textBox"]}
          value={salonName}
          onChange={(e) => setSalonName(e.target.value)}
          placeholder="Salon Name"
        />

        <label>Manager Full Name</label>
        <input
          type="text"
          className={styles["register__textBox"]}
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
          placeholder="Full Name"
        />

        <label>Description</label>
        <input
          type="text"
          className={styles["register__textBox"]}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <label>Location</label>
        <input
          type="text"
          className={styles["register__textBox"]}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
        <label>Choose salon images</label>
        <input
          type="file"
          multiple
          ref={ref}
          onChange={(e) => setImages(e.target.files)}
        />

        <button
          className={styles["register__btn"]}
          onClick={createSalonHandler}
        >
          Create Salon
        </button>
      </div>
    </div>
  );
}
export default CreateSalon;
