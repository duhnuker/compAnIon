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
    <div>
      <div>
        <h1>Welcome back,</h1>
        <form onSubmit={onSubmitForm}>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={email}
            onChange={e => onChange(e)}>
          </input>
          <br></br>
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={e => onChange(e)}>
          </input>
          <br></br>
          <div>
            <button>Login</button>
          </div>
        </form>
        <p>Don't have an account?</p>
        <div>
          <Link to="/register">Register here!</Link>
        </div>
      </div>
    </div>
  )
}

export default Login