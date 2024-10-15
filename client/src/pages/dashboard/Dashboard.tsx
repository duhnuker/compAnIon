import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import InputEntry from './journal/InputEntry';
import ListEntries from './journal/ListEntries';
import Navigation from '../../components/Navigation';

const Dashboard = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {

  const [name, setName] = useState("");
  const [allJournalEntries, setAllJournalEntries] = useState([]);
  const [journalEntriesUpdate, setJournalEntriesUpdate] = useState(false);

  const getProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/dashboard",
        {
          headers: { jwt_token: localStorage.token }
        }
      );

      const parseData = response.data;

      setAllJournalEntries(parseData);

      setName(parseData[0].user_name);

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  const logout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    getProfile();
    setJournalEntriesUpdate(false);
  }, [journalEntriesUpdate]);

  return (
    <div className='text-white h-screen w-full animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 pt-24'>
      <div className='h-full grid grid-cols-3 grid-rows-3 gap-4'>
        <div></div>
        <div className='flex flex-col items-center justify-center'>
          <Navigation />
          <h1 className='text-white text-5xl animate-fade-down'>Welcome, <span className='text-white'>{name}</span></h1>
          <h2 className='mt-20 text-lg animate-fade animate-delay-1000'>How are you feeling?</h2>
        </div>
        <div></div>
        <div></div>
        <div className='flex flex-col items-center justify-center'>
          <InputEntry setJournalEntriesUpdate={() => setJournalEntriesUpdate(true)} />
          <ListEntries allJournalEntries={allJournalEntries} setJournalEntriesUpdate={() => setJournalEntriesUpdate(true)} />
        </div>
        <div></div>
        <div></div>
        <div className='text-white flex justify-center items-center'>
          <button
            onClick={e => logout(e)}
            className='py-2 px-4 rounded-2xl border-2 border-red-900 bg-black text-white hover:bg-red-950 hover:text-red-100 transition-colors duration-300 animate-fade animate-delay-1000'
          >
            Logout
          </button>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default Dashboard