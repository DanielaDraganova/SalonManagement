import styles from "./Home.module.css";
import Background from "./backgr.jpg";

export const Home = () => {
  return (
    <div className={styles.container}>
      <img src={Background} alt="img" />
      <div className={styles.text}>
        <div className={styles["button-container"]}>
          <a href={`/catalog`} className={styles.button}>
            Browse all salons →
          </a>
        </div>
      </div>
    </div>
  );
};
