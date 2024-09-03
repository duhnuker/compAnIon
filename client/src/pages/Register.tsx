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
    <div>
      <div>
        <h1>Register</h1>
        <form onSubmit={onSubmitForm}>
          <input
            type='text'
            name='name'
            placeholder='Full Name'
            value={name}
            onChange={e => onChange(e)}
          />
          <br />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={email}
            onChange={e => onChange(e)}
          />
          <br />
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={e => onChange(e)}
          />
          <div className="text-center">
            <button>Submit</button>
          </div>
        </form>
        <p>Already have an account?</p>
        <div>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Register;