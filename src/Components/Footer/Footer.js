import styles from "./Footer.module.css";
function Footer() {
  return (
    <div className={styles["main-footer"]}>
      <table className={styles.container}>
        <tbody>
          <tr className={styles.row}>
            <td className={styles.col}>
              <h4 className={styles["col-title"]}>Divine Beauty</h4>
              <ul className={styles["list-unstyled"]}>
                <li>+1 209-650-0085</li>
                <li>California, USA</li>
              </ul>
            </td>

            <td className={styles.col}>
              <h4 className={styles["col-title"]}>App Author Info</h4>
              <ul className={styles["list-unstyled"]}>
                <li>Daniela Draganova</li>
                <li>daniela.st.draganova@gmail.com</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      <div className={styles["copyright-container"]}>
        <h3 className={styles.copyright}>
          &copy; {new Date().getFullYear()} Divine Beauty | All right reserved
        </h3>
      </div>
    </div>
  );
}

export default Footer;
