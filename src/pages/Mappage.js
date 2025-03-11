import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.js";
import Maps from "../components/Map.js";
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import '../maps.css'

function Mappage() {
  const { cityname } = useParams();
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");


  


  const fetching = async () => {
    try {
      const response = await axios.get(
        `http://api.geonames.org/searchJSON?q=${cityname}&maxRows=10&username=bunny4040351`
      );

      console.log("API Response:", response.data); // Debugging

      const firstResult = response.data.geonames[0] || {}; // Prevent undefined access
      setLatitude(firstResult.lat || "Not Found");
      setLongitude(firstResult.lng || "Not Found");
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetching();
  }, [cityname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    console.log("Updated Coordinates:", latitude, longitude);
    setLatitude(latitude)
    setLongitude(longitude)
  }, [latitude, longitude]); 

  return (
    <>
      <Navbar cityname={cityname} time={time}  link={`/weather/${cityname}`} />
      <Maps latitude={latitude} longitude={longitude} />
    </>
  );
}

export default Mappage;
