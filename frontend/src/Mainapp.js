import React, { Suspense, useEffect } from 'react'; // Import Suspense for lazy loading
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'; // Import useState for managing state
// Import your CSS files directly, as they are not lazy-loaded
import "./css/welcome.css";
import "./css/signup.css";
import "./css/login.css";
import { useSocket } from './SocketContext.js';
import { SocketProvider } from './SocketContext.js';
// Import components that are always rendered or are small enough not to benefit significantly from lazy-loading
import Navbar from "./components/navbar.jsx";
import Loading from './components/loading.jsx'; // Your existing Loader component from the Canvas
import Notifications from './pages/notifications.jsx';



const Welcome = React.lazy(() => import("./pages/welcome"));
const Login = React.lazy(() => import("./pages/login.jsx"));
const Signup = React.lazy(() => import("./pages/signup"));
const Home = React.lazy(() => import("./pages/home"));
const Logs = React.lazy(() => import('./pages/logs.jsx'));
const Users = React.lazy(() => import("./pages/users"));
const Activity = React.lazy(() => import('./pages/activity.jsx'));
const Tiptap = React.lazy(() => import('./pages/texteditor.jsx'));
const Viewpost = React.lazy(() => import('./pages/viewingpost.jsx')); // Ensure this path is correct for your Viewpost component
const Viewmyposts = React.lazy(() => import('./pages/viewmyposts.jsx'));



function MainApp() {
  const { socket, socketId } = useSocket();
  const [userrole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch("http://localhost:8000/role", {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
        });

        const msg = await response.json();

        if (response.ok && msg.message === "success") {
          setUserRole(msg.role);
          setUserName(msg.username);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRole();
  }, []);

  useEffect(() => {
    if (!socketId || !userrole) return;
    socket.emit("joiningroom", {
      role: userrole,
      username: userName,
      socketid: socketId
    });

    socket.on("joinedroom", (data) => {
      console.log("Joined room:", data.message);
    });
  }, [socketId, userrole, userName, socket]);

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/home"
            element={<><Navbar userrole={userrole} /><Home /></>}
          />
          <Route
            path="/home/users"
            element={<><Navbar userrole={userrole} /><Users /></>}
          />
          <Route path="/notifications" element={<Notifications />} />
          <Route
            path="/home/view logs"
            element={<><Navbar userrole={userrole} /><Logs /></>}
          />
          <Route
            path="/home/activity"
            element={<><Navbar userrole={userrole} /><Activity /></>}
          />
          <Route
            path="/home/createpost"
            element={<><Navbar userrole={userrole} /><Tiptap userrole={userrole} username={userName} /></>}
          />
          <Route
            path="/home/viewpost"
            element={<><Navbar userrole={userrole} /><Viewpost /></>}
          />
          <Route
            path="/home/:username"
            element={<><Navbar userrole={userrole} /><Viewmyposts /></>}
          />
        </Routes>
      </Suspense>
    </Router>
  );
}
export default MainApp;