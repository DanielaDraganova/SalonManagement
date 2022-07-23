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
        {/* <div className={styles["image-style"]}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png" />
          <p className="legend">Legend 1</p>
        </div>
        <div className={styles["image-style"]}>
          <img src="https://static.remove.bg/remove-bg-web/5c20d2ecc9ddb1b6c85540a333ec65e2c616dbbd/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png" />
          <p className="legend">Legend 2</p>
        </div>
        <div className={styles["image-style"]}>
          <img src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80" />
          <p className="legend">Legend 3</p>
        </div> */}

        {salon.imageUrls
          ? salon.imageUrls.map((i) => (
              <div className={styles["image-style"]}>
                <img src={i} />
                <p className="legend"></p>
              </div>
            ))
          : ""}
      </Carousel>
      <div className={styles.centered}>{salon.salonName}</div>
    </div>
  );
};

export default Details;
