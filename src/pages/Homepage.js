import React from "react";
import { useNavigate } from "react-router-dom";




  

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
    <div className="hero">
      <h1 className="title">Cloud☁️Y</h1>
      <p className="subtitle">Your personal weather assistant.</p>
      <button className="get-started-btn" onClick={() => navigate("/weather")}>
       <img src="right.png" alt="" />
      </button>
    </div>
  </div>
  )
};

export default Homepage;
