import React from 'react'
import { useQuery } from '@tanstack/react-query'
import '../css/admin.css'
import {useNavigate} from 'react-router-dom'

const fetchDashData = async () => {
  const response = await fetch('http://localhost:8000/dashdata',
    {
      method: 'GET',
      credentials: 'include',
      headers: { "Content-Type": "application/json" }
    }
  )
  const msg = await response.json()
  if (msg.message === 'success') {
    return msg.data
  } else {
    throw new Error('Unable to get the data')
  }
}


export default function Admin() {
  const navigate = useNavigate()
  const { data, error, isLoading } = useQuery({
    queryKey: ['dashData'],
    queryFn: fetchDashData,
    refetchInterval:2000
  })
  function go(event) {
    const text= event.target.innerText.toLowerCase()
    navigate(`/home/${text}`)
  }

  if (isLoading) return <p>Loading dashboard...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className='admin-dashboard'>
      <h2>Admin Dashboard</h2>
      <hr />
      <button onClick={go}>View logs</button>
      <button onClick={go}>Activity</button>
      <button onClick={go}>Users</button>
    </div>
  )
}
