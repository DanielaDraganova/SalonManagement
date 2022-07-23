import { useEffect, useState } from "react";
import { getAllSalons, getImageUrls } from "../../firebase";
import styles from "./Catalog.module.css";

const Catalog = () => {
  const [salons, setSalons] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const salonResults = await getAllSalons();

      const allSalons = [];

      console.log("aasdasdasasdasddfsdfasdasdasdasdsd");

      salonResults.forEach((doc) =>
        allSalons.push({ id: doc.id, ...doc.data() })
      );
      const finalPromise = Promise.all(
        allSalons.map(async (s) => {
          const imageUrls = await getImageUrls(s.imageIds);
          s.imageUrls = imageUrls;
        })
      );
      await finalPromise;

      console.log("ALL SALONS:");
      console.log(allSalons);
      setSalons(allSalons);
    };
    fetchData();
  }, []);
  //{s.salonName}

  const salonElements = salons.map((s) => (
    <div key={s.id} className="salon-container">
      <div className={styles["index-post"]}>
        <div className={styles.container}>
          <div className={styles["image-container"]}>
            {Object.entries(s.imageUrls ? s.imageUrls : []).map(
              ([key, imageId]) => {
                const imageKey = `image-${key}`;
                const image = `${imageId}`;

                return <img src={image} alt="" />;
              }
            )}
          </div>

          <div className={styles["meta-container"]}>
            <h2 className={styles.title}>{s.salonName}</h2>
            <span className={styles.desc}>{s.description}</span>
          </div>

          <div className={styles["button-container"]}>
            <a href="/salon-details" className={styles.button}>
              Reed More →
            </a>
          </div>
        </div>
      </div>
    </div>
  ));

  return <div>{salonElements}</div>;
};

export default Catalog;
