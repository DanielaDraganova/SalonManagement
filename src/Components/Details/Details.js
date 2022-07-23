import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOneSalon } from "../../firebase";

const Details = () => {
  const params = useParams();
  const salonId = params.salonId;
  const [salon, setSalons] = useState("");

  useEffect(() => {
    async function getOne() {
      const salonRes = await getOneSalon(salonId);
      console.log("RES");
      console.log(salonRes);
      setSalons(salonRes);
    }
    getOne();
  }, []);

  return <h1>Hello, {salon.salonName}</h1>;
};

export default Details;
