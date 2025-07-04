import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import Oauth from '../components/Oauth'

function Signup() {
  const [formdata, setFormdata] = useState({})
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handlechange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      setError(false)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formdata)
      })
      const data = await res.json();
      setLoading(false);
      if (data.status === 'error' || data.success === false) {
        setError(true)
        return;
      }
      setError(false)
       setFormdata({}) 
       navigate('/signin')
    } catch (error) {
      setLoading(false);
      setError(true)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input value={formdata.username || ""} type='text' id='username' placeholder='username' className='bg-slate-100 p-3 rounded-lg' onChange={handlechange} />
        <input  value={formdata.email || ""} type='email' id='email' placeholder='email' className='bg-slate-100 p-3 rounded-lg my-3' onChange={handlechange} />
        <input value={formdata.password || ""} type='password' id='password' placeholder='password' className='bg-slate-100 p-3 rounded-lg mb-3' onChange={handlechange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading..' : 'Sign Up'}
        </button>
        <Oauth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/signin'><span className='text-blue-500'>Sign In</span></Link>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
    </div>
  )
}

export default Signup