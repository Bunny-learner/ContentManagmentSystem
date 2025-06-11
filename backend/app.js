import dotenv from "dotenv"
dotenv.config()
import path from "path"
import cookieParser from "cookie-parser";
import express from "express"
import mongoose from "mongoose"
import { dbconnection } from "./db/dbconnect.js"
import cors from "cors"
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import router from "./Routes/router.js"
import { posts } from "./models/posts.js";
import {user} from "./models/schema.js";
import {notifydb} from "./models/notifications.js"
const app = express()




// ... (your existing imports and code) ...

app.use(cors({
  origin: function (origin, callback) {
    console.log('Incoming request origin:', origin); // Keep this crucial log!

    // Define all potential origins precisely
    const allowedOrigins = [
      "http://localhost:3000",        // For React dev server (e.g., CRA)
      "http://127.0.0.1:3000",        // Alternative for localhost:3000
      "http://192.168.174.180:3000",   // Phone accessing laptop's frontend (if frontend is on 3000)

      // The critical ones if your frontend is served by the backend on 8000:
      "http://localhost:8000",        // Exact match without trailing slash
      "http://localhost:8000/",       // Exact match WITH trailing slash (often sent by browsers)
      "http://127.0.0.1:8000",        // Alternative for localhost:8000 without trailing slash
      "http://127.0.0.1:8000/",       // Alternative for localhost:8000 WITH trailing slash

      // If phone accesses the frontend via the laptop's IP on port 8000:
      "http://192.168.174.180:8000",   // Laptop's actual IP without trailing slash
      "http://192.168.174.180:8000/",  // Laptop's actual IP WITH trailing slash

      // Add any other specific frontend ports you use (e.g., Vite's 5173)
      // "http://localhost:5173",
      // "http://192.168.174.180:5173"
    ];

    // Logic to check if the incoming origin is in our allowed list
    if (!origin) { // This handles same-origin requests where browser doesn't send an Origin header
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true); // Allow if origin is in the list
    } else {
      console.error('CORS blocked this origin:', origin); // This should tell us what's still not matching
      callback(new Error("Not allowed by CORS")); // Block if not in the list
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ... (rest of your app.js code) ...

app.use(express.static('public'));
app.use(cookieParser())


// app.js
// ... (your existing imports and code) ...
// ... (rest of your app.js code) ...
app.use(express.urlencoded({extended:true,limit:'100mb'}))
app.use(express.json({limit:'100mb'}))



const server=createServer(app)
// Inside your Socket.IO server setup
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.174.180:3000",
        "http://localhost:8000",
        "http://localhost:8000/",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:8000/",
        "http://192.168.174.180:8000",
        "http://192.168.174.180:8000/",
      ];
      console.log('Socket.IO CORS check for origin:', origin); // Add this log!
      if (!origin) {
        console.log('Socket.IO CORS: Origin is undefined, allowing.'); // Add this log
        callback(null, true);
      } else if (allowedOrigins.includes(origin)) {
        console.log('Socket.IO CORS: Origin ALLOWED:', origin); // Add this log
        callback(null, true);
      } else {
        console.error('Socket.IO CORS: Origin BLOCKED:', origin); // Add this log
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});


io.on('connection',(socket)=>{
  

const editorsroomid="34582345729384234583"

console.log('A user connected:', socket.id);
  
  

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

socket.on('requestforpublishing', async(data) => {
  const {username,title,description,content,role,image}=data
  const room=socket.id
  console.log(role,description)
  console.log("saving request details to the database")
  if(username&&title&&description&&content&&role){

    const newnotif=new notifydb({
      from:username,
      role:role,
      message:{
        title:title,
        description:description,
        content:content,
        image:image||"",
        status:'pending',
        seen:false
      }
    })
    await newnotif.save()
    console.log("<-<-saved to notifydb successfully->->->->")
  }

  io.to(editorsroomid).emit('editornotification', { from:username,role:role,roomid:socket.id})
  io.to(editorsroomid).emit('publishrequest',{
    name:username,
    title:title,
    desc:description
  })

});

socket.on('responsepost',async(data)=>{
  console.log("recieved response to server from the editor.")
  console.log(data.title,data.author,data.editorname)


  try {
    const post=await posts.findOne({username:data.author,title:data.title,status:'pending'})
    const notif=await notifydb.findOne({from:data.author,role:"viewer",'message.title':data.title,'message.status':'pending',})
    notif.message.status=data.status
    await notif.save()
    console.log('also updated the status in the notifications db')
    post.status=data.status
    await post.save()
    console.log('the post pending state has been updated by editor')
  } catch (error) {
    
  }
  try {
const posty=await user.findOne({username:data.author})
  console.log(posty.roomid+" Reply sent to this roomid.")
   io.to(posty.roomid).emit('viewernotification',{
  })
  console.log(data.msg,data.desc)
    io.to(posty.roomid).emit('publishresponse',{
    msg:data.msg,
    title:data.title,
    author:data.author,
    desc:data.desc,
    status:data.status
  })
  
}

 catch (error) {
    console.log(
      error
    )
  }
 
})

  
    socket.on('joiningroom', async(data) => {

    if(data.role.toLowerCase()==='editor'){

      socket.join(editorsroomid);
      socket.emit('joinedroom', { message: ` ${editorsroomid}` });
      console.log(`User ${data.username} with role ${data.role} joined the editor room`);
      return;

    }

    try {
      const who=await user.findOne({username:data.username, role:data.role})
      let roomid=who.roomid
      socket.join(roomid)
      socket.emit('joinedroom', { message: ` ${roomid}` });
    } catch (error) {
      
    }
    console.log(`User ${data.username} with role ${data.role} joined the room`);
    
  });


})

app.use('/',router)
export default server;;

