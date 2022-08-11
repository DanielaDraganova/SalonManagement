import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.centered}>
      <div className={styles.number}>404</div>
      <div className={styles.text}>
        <span>Ooops...</span>page not found
      </div>
      <a
        className={styles.me}
        href="https://codepen.io/uzcho_/pens/popular/?grid_type=list"
        target="_blank"
      />
    </div>
  );
};

export default NotFound;
