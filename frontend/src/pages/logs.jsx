import React,{useState,useEffect} from 'react'

export default function Logs() {
    const [data, setData] =useState([]) // State to hold user data
    useEffect(() => {
            // Fetch the user data from the API
            const fetchData = async () => {
                try {
                    const response = await fetch('http://localhost:8000/home/logs')
                    const result = await response.json()
                    if (result.message === 'success') {
                        setData(result.data)
                    } else {
                        console.error('Error fetching users:', result.message)
                    }
                } catch (error) {
                    console.error('Error fetching users:', error)
                }
            }
            fetchData()
        }, [])
  return (
    
    <div className='main'>
        <div className="logs">
            <h2>Logs</h2>
            <br />
         {data.length>0?(
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user, index) => (
                        <tr key={index}>
                            <td>{user.username}</td>
                            <td>{user.status}</td>
                            <td>{user.role}</td>
                            <td>{new Date(user.time).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
         ):(
            <p>No logs available.</p>
         )
         }
        </div>
      
    </div>
  )
}
