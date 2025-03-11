import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import "../weather.css"
import Spinner from  "../components/Spinner.js"
import { useNavigate } from "react-router-dom";

function Weatherpage({ onSearch }) {
  const [query, setQuery] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (query.length < 2) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://api.geonames.org/searchJSON?q=${query}&maxRows=10&username=bunny4040351`
        );
        console.log("Fetched cities:", response.data);
        setCities(response.data.geonames || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchCities, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  

  const navigate = useNavigate();
  const city = (e) => {
    const name = e.target.textContent.trim();
    if (name) {
      navigate(`/weather/${name}`);
    }
  };

  return (
    <>
    <div className="root1">
    <div className="search-container">
        <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
          <input
            className="form-control search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search for a city..."
          />
          <button className="btn btn-primary search-button" type="submit">
            🔍
          </button>
        </form>
      </div>

      {loading ? (
        <Spinner/>
       
      ):cities.length==0?( 
        <div className="no-cities-container" style={{height:"30vh",position:"relative",top:"20vh"}}>
          <p id="nothing-message">🌍 No Cities Found. Try a different search. 🔍</p>
        </div>
      ):(
        <div className="cities">
          {cities.length > 0 ? (
            cities.map((cityObj, index) => (
              <p onClick={city} key={index}>
                {cityObj.name}
              </p>
            ))
          ):null}
        </div>)}
    </div>
      
      
    </>
  );
}

export default Weatherpage;
