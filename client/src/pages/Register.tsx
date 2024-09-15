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
      <div className='h-screen w-full animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 flex items-center justify-center'>
        <div className='flex justify-evenly w-full'>
          <div>
            <h1 className='text-5xl pb-20 text-midnightp2 font-bold'>Join us,</h1>
            <form onSubmit={onSubmitForm}>
              <input
                className='mt-4 rounded-lg bg-black text-white'
                type='text'
                name='name'
                placeholder='Full Name'
                value={name}
                onChange={e => onChange(e)}
              />
              <br />
              <input
                className='mt-4 rounded-lg bg-black text-white'
                type='email'
                name='email'
                placeholder='Email'
                value={email}
                onChange={e => onChange(e)}
              />
              <br />
              <input
                className='mt-4 rounded-lg bg-black text-white'
                type='password'
                name='password'
                placeholder='Password'
                value={password}
                onChange={e => onChange(e)}
              />
              <div>
                <button className='mt-3 py-2 px-4 rounded-2xl border-2 border-red-900 bg-black text-white hover:bg-red-950 hover:text-red-100 transition-colors duration-300'>Register</button>
              </div>
            </form>
            <p className='text-white pt-10'>Already have an account?</p>
            <div className='text-white pt-4'>
              <Link to="/login" className='py-2 px-4 rounded-2xl border-2 border-red-900 bg-black text-white hover:bg-red-950 hover:text-red-100 transition-colors duration-300'>Login here!</Link>
            </div>
          </div>
          <div className='text-white bg-transparent'>
            <img src='compAnIonlogo.jpg' className='w-[400px] h-[400px] opacity-20' alt="compAnIon logo" />
          </div>
        </div>
      </div>
    )
  }
export default Register;