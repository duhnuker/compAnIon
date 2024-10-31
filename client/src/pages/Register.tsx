import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";

const Register = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: ""
  });

  const { email, password, name } = inputs;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const body = { email, password, name };
      const response = await axios.post("http://localhost:5000/auth/register",
        body,
        {
          headers: {
            "Content-Type": "application/json"
          }
        });

      const parseRes = response.data;
      localStorage.setItem("token", parseRes.jwtToken);
      setAuth(true);

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  return (
    <div className='min-h-screen w-full animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 flex items-center justify-center px-4 py-8'>
      <div className='flex flex-col-reverse md:flex-row justify-evenly w-full max-w-6xl gap-8'>
        <div className='w-full md:w-1/2 max-w-md mx-auto'>
          <h1 className='text-3xl md:text-5xl pb-10 md:pb-20 text-white font-bold animate-fade-down text-center md:text-left'>Join us,</h1>
          <form onSubmit={onSubmitForm} className='flex flex-col items-center md:items-start'>
            <input
              className='w-full max-w-sm mt-4 p-3 rounded-lg bg-black text-white animate-fade-up animate-delay-500'
              type='text'
              name='name'
              placeholder='Full Name'
              value={name}
              onChange={onChange}
            />
            <input
              className='w-full max-w-sm mt-4 p-3 rounded-lg bg-black text-white animate-fade-up animate-delay-500'
              type='email'
              name='email'
              placeholder='Email'
              value={email}
              onChange={onChange}
            />
            <input
              className='w-full max-w-sm mt-4 p-3 rounded-lg bg-black text-white animate-fade-up animate-delay-500'
              type='password'
              name='password'
              placeholder='Password'
              value={password}
              onChange={onChange}
            />
            <div className='w-full max-w-sm mt-6 flex justify-center md:justify-start'>
              <button className='w-full md:w-auto py-2 px-6 rounded-2xl border-2 border-red-900 bg-black text-white hover:bg-red-950 hover:text-red-100 transition-colors duration-300 animate-fade-up animate-delay-500'>Register</button>
            </div>
          </form>
          <div className='text-center md:text-left'>
            <p className='text-white pt-8 animate-fade-up animate-delay-500'>Already have an account?</p>
            <div className='text-white pt-4 animate-fade-up animate-delay-500'>
              <Link to="/login" className='inline-block py-2 px-4 rounded-2xl border-2 border-red-900 bg-black text-white hover:bg-red-950 hover:text-red-100 transition-colors duration-300'>Login here!</Link>
            </div>
          </div>
        </div>
        <div className='text-white bg-transparent flex justify-center items-center mb-8 md:mb-0'>
          <img src='compAnIonlogo.jpg' className='w-[200px] h-[200px] md:w-[400px] md:h-[400px] opacity-20' alt="compAnIon logo" />
        </div>
      </div>
    </div>
  )
}

export default Register;