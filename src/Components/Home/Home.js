import styles from "./Home.module.css";
import Background from "./backgr.jpg";
import { Fragment } from "react";

export const Home = () => {
  return (
    <Fragment>
      <div className={styles.container}>
        <img src={Background} alt="img" />
      </div>
      <a href="/catalog" className={styles["float"]}>
        <button className={styles["my-float"]}>Browse all salons →</button>
      </a>
    </Fragment>
  );
};
