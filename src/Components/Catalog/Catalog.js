import { useEffect, useState } from "react";
import { getAllSalons, getImageUrls } from "../../firebase";

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
    <div key={s.id} className="index-post">
      <div className="container">
        <div className="image-container">
          <div>{s.salonName}</div>

          {Object.entries(s.imageUrls ? s.imageUrls : []).map(
            ([key, imageId]) => {
              const imageKey = `image-${key}`;
              const image = `${imageId}`;

              return (
                <div key={imageKey}>
                  <img src={image} alt="" />
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  ));

  return <div>{salonElements}</div>;
};

export default Catalog;
