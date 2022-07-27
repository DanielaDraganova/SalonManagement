import styles from "./Home.module.css";
import Background from "./backgr.jpg";
import { Fragment } from "react";

export const Home = () => {
  return (
    <Fragment>
      <div className={styles.container}>
        <img src={Background} alt="img" />

        <div className={styles["button-container"]}>
          <a href={`/catalog`} className={styles.button}>
            Browse all salons →
          </a>
        </div>
      </div>
    </Fragment>
  );
};
