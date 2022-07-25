import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOneSalon, getImageUrls } from "../../firebase";

import styles from "./Details.module.css";

//let Carousel = require("react-responsive-carousel").Carousel;

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const Details = () => {
  const params = useParams();
  const salonId = params.salonId;
  const [salon, setSalon] = useState("");

  useEffect(() => {
    async function getOne() {
      const salonRes = await getOneSalon(salonId);

      const imageUrls = await getImageUrls(salonRes.imageIds);
      salonRes.imageUrls = imageUrls;
      setSalon(salonRes);
    }
    getOne();
  }, []);

  return (
    <div className={styles.container}>
      <Carousel>
        {salon.imageUrls
          ? salon.imageUrls.map((i) => (
              <div className={styles["image-style"]}>
                <img src={i} alt="salonImg" />
                <p className="legend"></p>
              </div>
            ))
          : ""}
      </Carousel>

      <div className={styles.centered}>{salon.salonName}</div>

      <div className={styles["button-container"]}>
        <a href={`/${salonId}/salon-edit`} className={styles.button}>
          Edit Salon →
        </a>
      </div>
    </div>
  );
};

export default Details;
