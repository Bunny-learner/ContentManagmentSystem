import React, { useEffect,useState } from 'react'
import { BrowserRouter as Router, Routes, Route,Link} from 'react-router-dom';
import '../css/navbar.css'
import { useNavigate } from 'react-router-dom';
import notif from '../assets/notification.png'
import belly from '../assets/bell.mp3'
import { useSocket } from "../SocketContext.js";



export default function Navbar(props) {
  const [num,setnum]=useState(0)
  const { socket } = useSocket();
  const navigate=useNavigate()

  useEffect(()=>{
    const fetchunseennotif=async ()=>{
    
console.log("inside fetchunseen")
console.log(props.name)
      await fetch('/unseen',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          name:props.name
        })
      })
    .then(response=>{
      return response.json()})
      .then(data=>{
        console.log(data.unseennotifications)
        if(data.unseennotifications.length!==0){
         document.querySelector('.bell-icon').classList.add('ring')
        setnum(data.unseennotifications.length)
        reddot(data.unseennotifications.length)}
        else 
        return ;
      })

      .catch(err=>{
        console.log(err)
      })

   }
    fetchunseennotif()
  },[document,props.name])


  
  useEffect(()=>{

    
    const editorsnotifications=(data)=>{
     console.log("Editor has recieved a Notification:")
     console.log("{\nfrom:",data.from)
     console.log("role:",data.role,"\n}")
      
      ringBell()
    }
    const viewersnotifications=(data)=>{
      console.log("Viewer has recieved a Notification ")
      ringBell()
    }
  
    socket.on('editornotification',editorsnotifications)
    socket.on('viewernotification',viewersnotifications)
    return()=>{
      socket.off('viewernotification',viewersnotifications)
      socket.off('editornotification',editorsnotifications)
    }

    
   

  },[socket,props.userrole])



  const reddot=(temp)=>{
const ele=document.querySelector('.hided')
    if(temp!=0){
      ele.classList.remove('hided')
      ele.classList.add('reddot')
     
      ele.innerHTML=`${temp}+`
    }
  }
  async function logout(){


  
   const response = await fetch("/logout", {
          method: "POST", 
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
        });
    const msg=await response.json()
    if(msg.m=="success"){
      navigate('/')
    }
    else{
      console.log(msg.m)
    }

  }
  function back() {
    navigate('/home')
  }

  function ringBell() {
  const audio = new Audio(belly); 
  document.querySelector('.different').classList.add('ring')
  audio.play();
}

function startedhover(e){
e.currentTarget.classList.add('ring')
}

function endhover(e){
e.currentTarget.classList.remove('ring')
}


function gotonotifications(){
navigate('/notifications')
}
  return (
    <>
     <nav className='navbar'>
    <div> <div className="hided"></div>
      <button className="different" onClick={gotonotifications} onMouseEnter={startedhover} onMouseLeave={endhover}><img id="bell" className="bell-icon" src={notif}/></button></div>
     
      <h2 id="pms">CmS</h2>
      
      <span>
        <button className='home' onClick={back}>Home</button>
        <button id="red" onClick={logout}>logout</button>
      </span>
     </nav>
  
    </>
  )
}
