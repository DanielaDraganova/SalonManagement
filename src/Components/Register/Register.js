import React, { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword } from "../../firebase";
import styles from "./Register.module.css";

const Register = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    repPass: "",
  });

  const [err, setErr] = useState({
    name: "",
    email: "",
    password: "",
    repPass: "",
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
        case "name":
          if (!value) {
            stateObj[name] = "Please enter your Full Name.";
          }
          break;

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
          } else if (input.repPass && value !== input.repPass) {
            stateObj["repPass"] =
              "Password and Repeat Password does not match.";
          } else {
            stateObj["repPass"] = input.repPass ? "" : err.repPass;
          }
          break;

        case "repPass":
          if (!value) {
            stateObj[name] = "Please enter your Repeat Password.";
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Password and Repeat Password does not match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const register = (e) => {
    e.preventDefault();

    let valid = true;
    Object.values(err).forEach((e) => {
      if (e.length != 0) {
        valid = false;
      }
    });
    if (!valid) {
    } else {
      registerWithEmailAndPassword(input.name, input.email, input.password);
    }
  };
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/catalog");
  }, [user, loading]);
  return (
    <Fragment>
      <div className={styles.welcome}>
        <h2>
          Join us and search
          <br />
          among the best beauty salons
          <br />
          in the world
        </h2>
      </div>

      <div className={styles.register}>
        <form onSubmit={register}>
          <div className={styles["register__container"]}>
            <label htmlFor="fullName">Full Name</label>
            <input
              required
              id="fullName"
              name="name"
              type="text"
              className={styles["register__textBox"]}
              value={input.name}
              placeholder="Full Name"
              onChange={onInputChange}
              onBlur={validateInput}
            />
            {err.name && <span className={styles.err}>{err.name}</span>}

            <label htmlFor="email">Email</label>
            <input
              required
              id="email"
              name="email"
              type="text"
              className={styles["register__textBox"]}
              value={input.email}
              placeholder="E-mail Address"
              onChange={onInputChange}
              onBlur={validateInput}
            />
            {err.email && <span className={styles.err}>{err.email}</span>}

            <label htmlFor="password">Password</label>
            <input
              required
              id="password"
              name="password"
              type="password"
              className={styles["register__textBox"]}
              value={input.password}
              placeholder="Password"
              onChange={onInputChange}
              onBlur={validateInput}
            />
            {err.password && <span className={styles.err}>{err.password}</span>}

            <label htmlFor="repPass">Repeat Password</label>
            <input
              required
              id="repPass"
              name="repPass"
              type="password"
              className={styles["register__textBox"]}
              value={input.repPass}
              placeholder="Repeat Password"
              onChange={onInputChange}
              onBlur={validateInput}
            />

            {err.repPass && <span className={styles.err}>{err.repPass}</span>}

            <button type="submit" className={styles["register__btn"]}>
              Register
            </button>

            <div>
              Already have an account? <Link to="/login">Login</Link> now.
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Register;
