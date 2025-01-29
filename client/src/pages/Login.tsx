import React, { useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';

const Login = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const { email, password } = inputs;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const body = { email, password };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        body,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const parseRes = response.data;

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        setAuth(true);
      } else {
        setAuth(false);
      }
    } catch (err) {
      console.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 flex items-center justify-center px-4 py-8'>
      <div className='flex flex-col-reverse md:flex-row justify-evenly w-full max-w-6xl gap-8'>
        <div className='w-full md:w-1/2 max-w-md mx-auto'>
          <h1 className='text-3xl md:text-5xl pb-10 md:pb-20 text-white font-bold animate-fade-down text-center md:text-left'>Welcome back,</h1>
          <form onSubmit={onSubmitForm} className='flex flex-col items-center md:items-start'>
            <input
              className='w-full max-w-sm mt-4 p-3 rounded-lg bg-black text-gray-400 hover:bg-white duration-500 animate-fade-up animate-delay-500'
              type='email'
              name='email'
              placeholder='Email'
              value={email}
              disabled={isLoading}
              onChange={onChange}>
            </input>
            <input
              className='w-full max-w-sm mt-4 p-3 rounded-lg bg-black text-gray-400 hover:bg-white duration-500 animate-fade-up animate-delay-500'
              type='password'
              name='password'
              placeholder='Password'
              value={password}
              disabled={isLoading}
              onChange={onChange}>
            </input>
            <div className='w-full max-w-sm mt-6 flex justify-center md:justify-start'>
              <button
                className='w-full md:w-auto py-2 px-6 rounded-2xl border-2 border-red-900 bg-black text-white hover:bg-red-950 hover:text-red-100 transition-colors duration-300 animate-fade-up animate-delay-500 disabled:opacity-50'
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
          <div className='text-center md:text-left'>
            <p className='text-white pt-8 animate-fade-up animate-delay-500'>Don't have an account?</p>
            <div className='text-white pt-4 animate-fade-up animate-delay-500'>
              <Link to="/register" className='inline-block py-2 px-4 rounded-2xl border-2 border-red-900 bg-black text-white hover:bg-red-950 hover:text-red-100 transition-colors duration-300'>Register here!</Link>
            </div>
          </div>
        </div>
        <div className='text-white bg-transparent flex justify-center items-center mb-8 md:mb-0'><a href='/'>
          <img src='compAnIonlogo.jpg' className='w-[200px] h-[200px] md:w-[400px] md:h-[400px] opacity-20' alt="compAnIon logo"></img>
        </a>
        </div>
      </div>
    </div>
  )
}

export default Login
