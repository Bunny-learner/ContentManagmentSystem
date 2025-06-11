import React, { useEffect, useState } from 'react'
import '../css/notifications.css'
import '../css/skeleton.css'

import { useNavigate } from 'react-router-dom'

import { useSocket } from '../SocketContext.js'
import Loadingskeleton from '../components/loadingskeleton.js'

export default function Notifications(props) {
  const {socket}=useSocket()
  const navigate = useNavigate()
  const [role, setRole] = useState('')  // default role
  const [loading, setLoading] = useState(true)
  const [type,setType]=useState('notifications')
  const [typer,setTyper]=useState('notifications')
  const [msgs,setmsgs]=useState([])
  
  
  useEffect(() => {
    async function fetchRole() {
      const res = await fetch("/role", {
                    method: "POST",
                    credentials: 'include', // Important for sending cookies
                    headers: { "Content-Type": "application/json" },
                });
      const data = await res.json()
      setRole(data.role)
      fetchmsgs(data.role)
     
      setLoading(false)
      console.log("role----",data.role)
      console.log("name======",props.name)
    }

   
    async function fetchmsgs(role){
       const res = await fetch("/msgs", {
                    method: "POST",
                    credentials: 'include', // Important for sending cookies
                    headers: { "Content-Type": "application/json" },
                    body:JSON.stringify({
                      role:role,
                      typer:typer,
                      type:type,
                      name:props.name
                    })
                });
      const data = await res.json()
       setmsgs(Array.isArray(data.msgs) ? data.msgs : []);
      console.log("role----inside fetcmsgs",role)
  
    
    }
    fetchRole()
    
  }, [type,typer,props.name])


useEffect(() => {
  if (loading) return;

  const isEditor = role.toLowerCase() === 'editor';
  const isNotificationsTab = (isEditor && type.toLowerCase() === 'notifications') ||
                              (!isEditor && typer.toLowerCase() === 'notifications');

  if (isNotificationsTab) {
    addnotification();
  }

  
  return () => {
    socket.off('publishrequest');
    socket.off('publishresponse');
  };

}, [loading, type, typer, role]);


  async function logout() {
    const response = await fetch("/logout", {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
    })
    const msg = await response.json()
    if (msg.m === "success") {
      navigate('/')
    } else {
      console.log(msg.m)
    }
  }

  function back() {
    navigate('/home')
  }

  function changetype(e){
 const text=e.target.textContent.toLowerCase().trim();
 console.log(text)
    setLoading(true)
    
    if(text==='notifications') {
      setTimeout(()=>{
        setType('Notifications')
        addnotification()
      },1000)
      
    }
    else if(text=='approved'){
     setTimeout(()=>{
        setType('Approved')
        setLoading(false)
        
      },1000)
    }
     else{
      setTimeout(()=>{
        setType('Rejected')
        setLoading(false)
      },1000)
      
    }
   
  }

  function editorgoes(e){
    const title=e.currentTarget.querySelector('.title').textContent
    const user=e.currentTarget.querySelector('.role').textContent
    console.log(title,user)
    navigate(`/home/viewpost?user=${user}&title=${title}&inNotif=true`)
  }

  async function addnotification(){
     setLoading(false)
    console.log("addnotification called")
  const ne=document.querySelector('.notify-editor')
  const nv=document.querySelector('.notify-viewer')
    const handlerequestdata=(data)=>{
      console.log("handlerequest called")
      const {title,name,desc}=data
      const ele=document.createElement('li')
      ele.addEventListener('click',editorgoes)
      ele.classList.add('vmsgs')
      ele.innerHTML=`<p class='from'>
                <span>From:viewer</span>
                <span class='reg'>Request for publishing</span></p>
              
              <p class='title'>${title}</p>
              <span class='desc'>${desc.slice(0,300)}</span>
              <p class='from role'>${name}</p>`
      ne.append(ele)
      socket.emit('')
    }
    const handleresponsedata=(data)=>{
      const{title,desc,msg}=data
      console.log("handleresponse called")
      const ele=document.createElement('li')
      ele.addEventListener('click',editorgoes)
      ele.classList.add('vmsgs')
      ele.innerHTML=`<p class='from'>
                <span>From:editor</span>
                <span class='reg'>Regarding Publishing</span></p>
              <p class='title'>${title}</p>
              <p class='reply'>${msg}</p>`
      nv.append(ele)
    }
    socket.on('publishrequest',handlerequestdata)
    socket.on('publishresponse',handleresponsedata)
  }

  function changetyper(e){
 const text=e.target.textContent.toLowerCase().trim();
    setLoading(true)
    
    if(text==='notifications') {
      setTimeout(async()=>{
        setTyper('notifications')
        addnotification()
      },1000)
      
    }
     else{
      console.log(text)
      setTimeout(()=>{
        setTyper('Pending')
        setLoading(false)
      },1000)
  }}



  return (<>
    <nav className='navbar'>
        <h2>CmS</h2>
        <span>
          <button className='home' onClick={back}>Home</button>
          <button id="red" onClick={logout}>Logout</button>
        </span>
      </nav>
      <div className="main">
        <div className='any'>
      
  <div className='allposts'>

      <header id="newheader">
        {role.toLowerCase() === 'editor' && 
          <>
          <span className='group'>
            <button className="tab" onClick={changetype}>Notifications</button>
            <button className="tab" onClick={changetype}>Approved</button>
            <button className="tab" onClick={changetype}>Rejected</button>
          </span>
            
          </>
        }
        {role.toLowerCase() === 'viewer' && 
          <>
          <span className='group'>
            <button className="tab" onClick={changetyper}>Pending</button>
            <button className="tab" onClick={changetyper}>Notifications</button>
          </span>
            
          </>
        }
      </header>
<main>
 
 {
  role.toLowerCase()=='editor'?(<>{!loading?(
  <div className="notifications-container">
     {type.toLowerCase().trim()==='notifications'?(
      <>
      <h2>Notifications</h2>
        <div className="notifications-content">
          <ul className='notify-editor'>{!loading?(<>{msgs.length>0 ?(msgs.map((item, index) => (
            <li className='vmsgs' onClick={editorgoes} key={index}>
              <p className='from'>
                <span >From:{item.role}</span>
                <span className='reg'>Request for publishing</span></p>
                
              <p className='title'>{item.message.title}</p>
              <span className='desc'>{item.message.description.slice(0,300)}.....</span>
              <p className='from role'>{item.from}</p>
              </li>
          ))):
          (<>No new notifications</>)}</>):(<Loadingskeleton/>)}</ul>
          {/* <div className="msg"> <input type="text" placeholder='Send message..' />
        <button>send</button></div> */}
        </div>
        </>
        ):(
           <>
      <h2>{type}</h2>
        <div className="notifications-content">
          <ul className='rejected'>{msgs.length>0 ?(msgs.map((item, index) => (
            <li className='vmsgs' onClick={editorgoes} key={index}>
              <p className='from'>
                <span >From:{item.role}</span>
                <span >{type}</span></p>
                
              <p className='title'>{item.message.title}</p>
              <span className='desc'>{item.message.description.slice(0,300)}.....</span>
              <p className='from role text-[red]' >{item.from}</p>
              </li>
          ))):
          (<>No {type} notifications</>)}</ul>
        </div></>
        )}
      </div>):(<Loadingskeleton/>)}</>):

(<>{!loading?(<div className="notifications-container">
     {typer.toLowerCase().trim()=='notifications'?(
      <>
      <h2>Notifications</h2>
        <div className="notifications-content">
          <ul className='notify-viewer'>{msgs.length>0 ?(msgs.map((item, index) => (
            <li className='vmsgs' key={index}>
              <p className='from'>
                <span>From:{item.role}</span>
                <span className='reg'>Regarding publishing post</span></p>
              <p className='title'>Title:{item.message.title}</p>
              <span className='rfe'>{item.message.msg}</span>
              </li>
          ))):
          (<>No new notifications</>)}</ul>
        </div></>
        ):(
           <>
      <h2>{typer}</h2>
        <div className="notifications-content">
          <ul className='rejected'>{msgs.length>0 ?(msgs.map((item, index) => (
            <li className='vmsgs' key={index}>
              <p className='from'>
                <span>From:{item.role}</span>
                <span className='reg'>Regarding publishing post</span></p>
              <p className='title'>{item.message.title}</p>
              <span className='rfe'>{item.message.msg}</span>
              </li>
          ))):
          (<>No {typer} notifications</>)}</ul>
        </div></>
        )}
      </div>):(< Loadingskeleton/>)}</>)}
      
</main>
      
      </div>
    </div>
      </div>
    
    </>
  )
}
