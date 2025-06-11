import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'


export default function Welcome() {
  
  const navigate=useNavigate()
  
  return (
    <>
    <nav className="welcomenav">
        <span className="logo"><img src="./logo192.png" alt="" /></span>
        <span className='buttons'>
        <button onClick={()=>navigate("/login")}>login</button>
        <button onClick={()=>navigate("/signup")}>signup</button>
        </span>
        
    </nav>
    <main className='welcome'>
   <h1>Content Management system 😁😀</h1>
    </main>
    </>
  )
}

