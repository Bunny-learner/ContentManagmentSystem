import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../cityweather.css";
import "../components/Navbar.css";
import Navbar from "../components/Navbar.js";

const weatherIcons = {
  Clear: "☀️",
  Clouds: "🌥️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌁",
  Haze: "🌫️",
  Smoke: "💨",
  Dust: "🌪️",
};

const getWeatherIcon = (description) => {
  return weatherIcons[description] || "❓";
};







const Citypage = () => {
  const navigate = useNavigate();
  const { cityname } = useParams();
  const [weather, setWeather] = useState([]);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=0ca1da5436fdd8ca5b86801fb962ef7f&units=metric`)
      .then((response) => {
        console.log("weather data:", response.data);
        setWeather(
          response.data.list.slice(0, 6).map((item) => ({
            ...item,
            flipped: false,
          }))
        ); // Take first 6 forecasts
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [cityname]);

  const handleFlip = (index) => {
    setWeather((prev) =>
      prev.map((item, i) => (i === index ? { ...item, flipped: !item.flipped } : item))
    );
  };

  return (
    <>
     <Navbar cityname={cityname} time={time} link="/weather" />
      <div className="root2">
        <ul className="weathercontainer">
          {weather.length > 0 ? (
            weather.map((data, index) => {
              const weatherDesc = data.weather[0].main;
              const icon = getWeatherIcon(weatherDesc);
  
              return (
                <li
                  key={index}
                  className={`weather-card ${data.flipped ? "flipped" : ""}`}
                  onClick={() => handleFlip(index)}
                >
                  <div className="weather-card-inner">
                    {/* Front Side */}
                    <div className="weather-card-front">
                      <h3 className="feel">
                        {new Date(data.dt * 1000).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </h3>
                      <h6>{data.dt_txt.slice(10)}</h6>
                      <p className="temp">{data.main.temp}°C</p>
                      <p className="weather-icon">{icon}</p>
                      <p>{weatherDesc}</p>
                      <p className="feel">Feels like {data.main.feels_like}°C</p>
                      <p className="feel">Humidity: {data.main.humidity}%</p>
                    </div>
  
                    {/* Back Side */}
                    <div className="weather-card-back">
                      <h4>Weather Details</h4>
  
                      <div className="weather-detail-group">
                        <p>🌫 <b>Visibility:</b> {data.visibility} meters</p>
                        <p>☔ <b>Precipitation:</b> {data.pop * 100}%</p>
                      </div>
  
                      <div className="weather-detail-group">
                        <p>💨 <b>Wind Speed:</b> {data.wind.speed} m/s</p>
                        <p>🧭 <b>Direction:</b> {data.wind.deg}°</p>
                        <p>🌪 <b>Gust Speed:</b> {data.wind.gust || "N/A"} m/s</p>
                      </div>
  
                      <div className="weather-detail-group">
                        <p>🌅 <b>Time:</b> {data.sys.pod === "n" ? "Night 🌙" : "Day ☀️"}</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <p id="no-cities-message">🌍 Weather data of {cityname} was not found.😥</p>
          )}
        </ul>
      </div>
    </>
  );
}  

export default Citypage;  