import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar.jsx';
import '../css/users.css';

export default function Users() {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/home/users',{
          method: 'GET',
          credentials: 'include',
          headers: { "Content-Type": "application/json" }
        });
        const result = await response.json();
        if (result.message === 'success') {
        
          setData(result.data);
          setCurrent(result.currentUser);
    
        } else {
          console.error('Error fetching users:', result.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  const roles = (event, username) => {
    const selectedRole = event.target.value;

    // Optimistically update UI
    setData(prev =>
      prev.map(user =>
        user.username === username ? { ...user, role: selectedRole } : user
      )
    );

    fetch('http://localhost:8000/home/role', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({ username: username, role: selectedRole }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'success') {
          console.log('Role updated successfully');
  
        } else {
          console.error('Error updating role:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='main'>
      <div className='users'>
        {data.length > 0 ? (
          <>
            <h2>Registered Users</h2>
            <table className='users-table'>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Current Role</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    {item.username!=current &&<>
                    <td>{item.username.charAt(0).toUpperCase() + item.username.slice(1).toLowerCase()}</td>
                    <td><strong>{item.role.charAt(0).toUpperCase() + item.role.slice(1).toLowerCase()}</strong></td>
                    <td>
                      <select value={item.role} onChange={e => roles(e, item.username)}>
                        <option value="" selected disabled >Select role</option>
                        <option value="admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td></>
                  }
                  </tr>
                    
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No registered users found</p>
        )}
      </div>
    </div>
  );
}
