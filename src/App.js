import logo from './logo.svg';
import './Homepage.css';
import './weather.css'
import Weatherpage from './pages/Weatherpage.js';
import Homepage from './pages/Homepage.js'; 
import Citypage from './pages/cityweather.js'; 
import Mappage from './pages/Mappage.js'; 
import "leaflet/dist/leaflet.css";
import "./maps.css"



import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/weather" element={<Weatherpage/>}/>
        <Route path="/weather/:cityname" element={<Citypage/>}/>
        <Route path="/weather/:cityname/viewmap" element={<Mappage/>}/>

      </Routes>
    </Router>
  
  );
}

export default App;
