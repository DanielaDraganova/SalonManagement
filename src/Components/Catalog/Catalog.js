import { doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getAllSalons } from "../../firebase";

const Catalog = () => {
  const [salons, setSalons] = useState([]);
  useEffect(() => {
    getAllSalons().then((res) => {
      const allSalons = [];

      res.forEach((doc) => allSalons.push({ id: doc.id, ...doc.data() }));
      console.log("SALONDS:");
      console.log(allSalons);
      setSalons(allSalons);
    });
  }, []);

  const salonElements = salons.map((s) => <div key={s.id}>{s.salonName}</div>);

  return <div>{salonElements}</div>;
};

export default Catalog;
