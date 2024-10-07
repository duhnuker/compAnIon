import React, { useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';

const Login = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {

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

    try {
      const body = { email, password };

      const response = await axios.post(
        "http://localhost:5000/auth/login",
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
    }
  };

  return (
    <div className='h-screen w-full animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 flex items-center justify-center'>
      <div className='flex justify-evenly w-full'>
        <div>
          <h1 className='text-5xl pb-20 text-white font-bold animate-fade-down'>Welcome back,</h1>
          <form onSubmit={onSubmitForm}>
            <input
              className='mt-4 rounded-lg bg-black text-white animate-fade-up animate-delay-500'
              type='email'
              name='email'
              placeholder='Email'
              value={email}
              onChange={e => onChange(e)}>
            </input>
            <br></br>
            <input
              className='mt-4 rounded-lg bg-black text-white animate-fade-up animate-delay-500'
              type='password'
              name='password'
              placeholder='Password'
              value={password}
              onChange={e => onChange(e)}>
            </input>
            <br></br>
            <div>
              <button className='mt-3 py-2 px-4 rounded-2xl border-2 border-red-900 bg-black text-white hover:bg-red-950 hover:text-red-100 transition-colors duration-300 animate-fade-up animate-delay-500'>Login</button>
            </div>
          </form>
          <p className='text-white pt-10 animate-fade-up animate-delay-500'>Don't have an account?</p>
          <div className='text-white pt-4 animate-fade-up animate-delay-500'>
            <Link to="/register" className='py-2 px-4 rounded-2xl border-2 border-red-900 bg-black text-white hover:bg-red-950 hover:text-red-100 transition-colors duration-300'>Register here!</Link>
          </div>
        </div>
        <div className='text-white bg-transparent'>
          <img src='compAnIonlogo.jpg' className='w-[400px] h-[400px] opacity-20'></img>
        </div>
      </div>
    </div>
  )
}

export default Login