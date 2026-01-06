import { Link } from 'react-router-dom'
import LightPillar from '../components/LightPillar'

const Landing = () => {
  return (
    <div className='h-screen w-full relative overflow-hidden'>
      <LightPillar />
      <div className="absolute inset-0 bg-midnightp1 -z-10"></div>

      <div className='h-full grid grid-cols-3 grid-rows-3 gap-4 relative z-10'>
        <div>
        </div>
        <div className='flex flex-col items-center justify-center mt-10'>
          <h1 className='text-gray-300 text-5xl animate-fade-down'>Comp<span className='text-red-800 animate-fade-down'>A</span>n<span className='text-red-800 animate-fade-down'>I</span>on</h1>
          <p className='text-gray-400 pt-16 md:text-2xl text-xl text-center animate-fade-down'>Your safe space, Always with you</p>
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
        <div className='flex flex-col justify-center items-center gap-6'>
          <div className='flex justify-center items-center gap-6'>
            <Link to="/login" className='w-40 py-4 rounded-xl border-black bg-black text-gray-300 text-center hover:bg-red-950 hover:text-red-100 transition-colors duration-300 text-lg animate-fade-up animate-delay-500'>Login</Link>
            <Link to="/register" className='w-40 py-4 rounded-xl border-black bg-black text-gray-300 text-center hover:bg-red-950 hover:text-red-100 transition-colors duration-300 text-lg animate-fade-up animate-delay-500'>Register</Link>
          </div>
          <Link to="/guest-login" className='text-gray-400 hover:text-white transition-colors duration-300 text-sm border-b border-transparent hover:border-gray-400 animate-fade-up animate-delay-700'>
            Guest Login
          </Link>
        </div>
        <div>
        </div>
      </div>
    </div>
  )
}

export default Landing