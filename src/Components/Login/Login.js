import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from "./Login.module.css";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

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

  const login = (e) => {
    e.preventDefault();

    let valid = true;
    Object.values(err).forEach((e) => {
      if (e.length != 0) {
        valid = false;
      }
    });
    if (!valid) {
    } else {
      logInWithEmailAndPassword(input.email, input.password);
    }
  };
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/catalog");
  }, [user, loading]);

  return (
    <div className={styles.login}>
      <form onSubmit={login}>
        <div className={styles["login__container"]}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            required
            id="emails"
            type="text"
            name="email"
            className={styles["login__textBox"]}
            value={input.email}
            placeholder="E-mail Address"
            onChange={onInputChange}
            onBlur={validateInput}
          />
          {err.email && <span className={styles.err}>{err.email}</span>}

          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            required
            id="password"
            type="password"
            name="password"
            className={styles["login__textBox"]}
            value={input.password}
            placeholder="Password"
            onChange={onInputChange}
            onBlur={validateInput}
          />
          {err.password && <span className={styles.err}>{err.password}</span>}

          <button type="submit" className={styles["login__btn"]}>
            Login
          </button>

          <div>
            Don't have an account? <Link to="/register">Register</Link> now.
          </div>
        </div>
      </form>
    </div>
  );
};
export default Login;
