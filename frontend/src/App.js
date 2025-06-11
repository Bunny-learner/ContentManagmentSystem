import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your CSS files directly, as they are not lazy-loaded
import "./css/welcome.css";
import "./css/signup.css";
import "./css/login.css";
import './css/posts.css'
import './css/navbar.css'
import './css/home.css'
import './css/admin.css'

// Import components that are always rendered or are small enough not to benefit significantly from lazy-loading
import Navbar from "./components/navbar.jsx";
import Loading from './components/loading.jsx'; // Your existing Loader component
import Notifications from './pages/notifications.jsx';
import Tiptap from './pages/texteditor.jsx';

// Import the useSocket hook from your SocketContext
import { useSocket } from './SocketContext.js';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Lazy-loaded components for better performance
const Welcome = React.lazy(() => import("./pages/welcome"));
const Login = React.lazy(() => import("./pages/login.jsx"));
const Signup = React.lazy(() => import("./pages/signup"));
const Home = React.lazy(() => import("./pages/home"));
const Logs = React.lazy(() => import('./pages/logs.jsx'));
const Users = React.lazy(() => import("./pages/users"));
const Activity = React.lazy(() => import('./pages/activity.jsx'));

const Viewpost = React.lazy(() => import('./pages/viewingpost.jsx'));
const Viewmyposts = React.lazy(() => import('./pages/viewmyposts.jsx'));



function App() {
  const location = useLocation(); 
  const { socket } = useSocket();
  const [userrole, setuserRole] = useState('');
  const [userName, setuserName] = useState('');
  const navigate=useNavigate()
  const [isRoleFetched, setIsRoleFetched] = useState(false);

  useEffect(() => {
    const path = location.pathname;

    const shouldFetchRole = !(
      path.includes('login') ||
      path.includes('signup') ||
      path === '/'
    );

    const fetchRole = async () => {
      console.log("App.js: Initiating fetchRole API call...");
      try {
        const response = await fetch("/role", {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
        });

        const msg = await response.json();

        if (response.ok && msg.message === "success") {
          setuserRole(msg.role);
          setuserName(msg.username);
          console.log(`Fetched role: ${msg.role}, username: ${msg.username}`);
        } else {
          navigate('/login')
          console.error("Failed to fetch role:", msg.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setuserRole('');
        setuserName('');
      } finally {
        setIsRoleFetched(true);
      }
    };

    if (shouldFetchRole) {
      fetchRole();
    }

  }, [location]); // Runs every time the URL path changes


    useEffect(() => {
       
        if (!socket) {
            console.log("App.js: Socket object not available for event listeners yet.");
            return;
        }
        
        const handleSocketConnect = () => {
            console.log("App.js: Socket connected/reconnected. ID:", socket.id);
            // Attempt to join the room ONLY if userName and userrole are valid AND fetched
            if (isRoleFetched && userName && userrole) {
                console.log(`App.js: On 'connect' event, attempting to join room with username: '${userName}', role: '${userrole}'`);
                socket.emit('joiningroom', { username: userName, role: userrole });
            } else {
                console.log("App.js: On 'connect' event, userName/userrole not yet available or fetched. Will try again when they are.");
                console.log(`  Current state: isRoleFetched=${isRoleFetched}, userName='${userName}', userrole='${userrole}'`);
            }
        };

        // Handler for the 'joinedroom' confirmation from the server
        const handleJoinedRoomConfirmation = (data) => {
            console.log("App.js: Successfully joined room:", data.message);
            // You can add further UI updates here, e.g., show a success toast.
        };

        // Attach event listeners
        socket.on('connect', handleSocketConnect);
        socket.on('joinedroom', handleJoinedRoomConfirmation);

        // Initial join attempt:
        // This handles cases where the component mounts and the socket is already connected
        // and the user role/name has already been fetched (e.g., on a page refresh).
        if (socket.connected && isRoleFetched && userName && userrole) {
            console.log(`App.js: Initial mount/render: Attempting to join room with username: '${userName}', role: '${userrole}'`);
            socket.emit('joiningroom', { username: userName, role: userrole });
        } else {
            console.log("App.js: Initial mount/render: Conditions not met for immediate room join attempt.");
            console.log(`  Socket connected: ${socket.connected}`);
            console.log(`  Role fetched: ${isRoleFetched}`);
            console.log(`  Username: '${userName}'`);
            console.log(`  Role: '${userrole}'`);
        }

        // Cleanup function: This runs when the component unmounts or when any
        // of the dependencies in the array change, to prevent memory leaks.
        return () => {
            console.log("App.js: Cleaning up socket event listeners for room joining.");
            socket.off('connect', handleSocketConnect);
            socket.off('joinedroom', handleJoinedRoomConfirmation);
        };
    }, [socket, userName, userrole, isRoleFetched]); // Dependencies for this useEffect

    return (
        <>
            {/* Wrap your Routes with Suspense. The fallback prop will display the Loader component
                while the lazy-loaded components are being fetched and rendered. */}
            <Suspense fallback={<Loading />}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Welcome />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />

                    {/* Authenticated routes, typically including a Navbar */}
                    {/* For routes that consistently use Navbar, you can nest them or include Navbar directly */}
                    <Route
                        path="/home"
                        element={
                            <>
                                <Navbar userrole={userrole} name={userName}/>
                                <Home />
                            </>
                        }
                    />
                    <Route
                        path="/home/users"
                        element={
                            <>
                                <Navbar userrole={userrole} name={userName}/>
                                <Users />
                            </>
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <>
                                < Notifications name={userName}/>
                            </>
                        }
                    />
                    <Route
                        path="/home/view logs"
                        element={
                            <>
                                <Navbar role={userrole} name={userName}/> {/* Note: You passed 'role' prop here, not 'userrole' */}
                                <Logs />
                            </>
                        }
                    />
                    <Route
                        path="/home/activity"
                        element={
                            <>
                                <Navbar userrole={userrole} name={userName}/>
                                <Activity />
                            </>
                        }
                    />
                    <Route
                        path="/home/createpost"
                        element={
                            <>
                                <Navbar userrole={userrole} name={userName}/>
                                <Tiptap userrole={userrole} name={userName} /> {/* Changed 'name' to 'username' for consistency */}
                            </>
                        }
                    />
                    <Route
                        path="/home/viewpost"
                        element={
                            <>
                                <Navbar userrole={userrole} name={userName}/>
                                <Viewpost userrole={userrole} />
                            </>
                        }
                    />
                    <Route
                        path="/home/:username"
                        element={
                            <>
                                <Navbar userrole={userrole} name={userName}/>
                                <Viewmyposts />
                            </>
                        }
                    />
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
