import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className='h-screen w-full animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2'>
      <div className='h-full grid grid-cols-3 grid-rows-3 gap-4'>
        <div>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-white text-5xl'>Comp<span className='text-red-800'>A</span>n<span className='text-red-800'>I</span>on</h1>
          <p className='text-white pt-16 md:text-2xl text-xl text-center'>Your safe space, Always here, Always with you</p>
        </div>
        <div>
        </div>
        <div>
        </div>
        <div className='flex items-center justify-center'>
          <img src='compAnIonlogo.jpeg' className='w-[300px] rounded-full opacity-50 shadow-2xl'></img>
        </div>
        <div>
        </div>
        <div>
        </div>
        <div className='text-white flex justify-center items-center'>
          <div className='pr-8'>
            <Link to="/login" className='py-2 px-4 rounded-2xl border-2 border-red-900 bg-black text-white hover:bg-red-950 hover:text-red-100 transition-colors duration-300'>Login</Link>
          </div>
          <div>
            <Link to="/register" className='py-2 px-4 rounded-2xl border-2 border-red-900 bg-black text-white hover:bg-red-950 hover:text-red-100 transition-colors duration-300'>Register</Link>
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
  )
}

export default Landing