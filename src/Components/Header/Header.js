import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../../firebase";
import styles from "./Header.module.css";

function Header() {
  const [isNavActive, setIsNavActive] = useState(false);

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const toggleNavActive = (e) => {
    setIsNavActive((current) => !current);
  };

  const logoutAndNavigateToHome = () => {
    logout();
    navigate("/");
  };
  return (
    <nav>
      <div className={styles["nav-links"]}>
        <a href="/catalog">
          <img style={{ width: "90px" }} src="/logo.png" alt="logo" />
          DIVINE BEAUTY ✿
        </a>
      </div>
      <ul
        className={`${isNavActive ? styles["nav-active"] : ""} ${
          styles["nav-links"]
        }`}
      >
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/catalog">Catalog</a>
        </li>
        {user ? (
          <React.Fragment>
            <li>
              <a onClick={logoutAndNavigateToHome}>Logout</a>
            </li>

            <li>
              <a href="/create-salon">Add salon</a>
            </li>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/register">Register</a>
            </li>
          </React.Fragment>
        )}

        <li>Welcome, {user ? user.email : "guest"}</li>
      </ul>
      <div className={styles.burger} onClick={toggleNavActive}>
        <div className={styles.line1}></div>
        <div className={styles.line2}></div>
        <div className={styles.line3}></div>
      </div>
    </nav>
  );
}

export default Header;
