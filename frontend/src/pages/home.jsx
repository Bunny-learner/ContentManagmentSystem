import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Admin from './admin_dashboard.jsx'
import Navbar from '../components/navbar.jsx'
import Viewer from '../pages/viewer.jsx';
import Posts from '../pages/posts.jsx';
import '../css/home.css'
import { useSocket } from "../SocketContext.js";

export default function Home() {
  const [role, setRole] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { socket } = useSocket();
  useEffect(() => {

    const fetchRole = async () => {
      try {

        const response = await fetch("/role", {
          method: "POST", 
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
        });

        const msg = await response.json();
        
        if (response.ok && msg.message === "success") { 
          setRole(msg.role);
        } 
        else{
          navigate('/login')
        }
      }
      catch(error) {
        console.error("Error fetching role:", error);
        setError("Failed to fetch role. Please log in."); 
        navigate('/login'); // Redirect to login on network/other errors
      } finally {
        setLoading(false);
      }
    

    fetchRole();}
  }, []); 




  return(<>
  <div className="main">
    {role.toLowerCase()==='admin'?
     (<Admin />):
      role.toLowerCase()==='editor'?(
        <Posts/>
      ):(<Posts/>)
     }
  </div></>
    
   
  
  );
}
