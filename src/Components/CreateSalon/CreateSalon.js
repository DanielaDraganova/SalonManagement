import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, createSalonInDB } from "../../firebase";
import styles from "../Register/Register.module.css";

function CreateSalon() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const createSalon = () => {
    if (!name) alert("Please enter name");
    createSalonInDB({ name, description, location });
  };
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div className={styles.register}>
      <div className={styles["register__container"]}>
        <label>Manager Full Name</label>
        <input
          type="text"
          className={styles["register__textBox"]}
          value={name}
          onChange={(e) => setName(e.target.value)}
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

        <button className={styles["register__btn"]} onClick={createSalon}>
          Create Salon
        </button>
      </div>
    </div>
  );
}
export default CreateSalon;
