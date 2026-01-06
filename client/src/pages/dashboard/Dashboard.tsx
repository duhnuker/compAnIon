import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import InputEntry from './journal/InputEntry';
import Navigation from '../../components/Navigation';

const Dashboard = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {

  const [name, setName] = useState("");
  const [journalEntriesUpdate, setJournalEntriesUpdate] = useState(false);
  const [recentEntry, setRecentEntry] = useState<any>(null);
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard`,
        {
          headers: { jwt_token: localStorage.token }
        }
      );

      setName(response.data.user_name);

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  const getRecentEntry = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/journalentries/recent`, {
        headers: { jwt_token: localStorage.token }
      });
      setRecentEntry(response.data);
    } catch (error) {
      console.error('Error fetching recent entry:', error);
    }
  };



  useEffect(() => {
    if (!localStorage.token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    getProfile();
    getRecentEntry();
    setJournalEntriesUpdate(false);
  }, [journalEntriesUpdate]);

  return (
    <div className='text-white min-h-screen w-full animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 pt-32 md:pt-40'>
      <div className='h-full flex flex-col items-center gap-4 px-4 md:px-0'>
        <div className='flex flex-col items-center justify-center text-center mt-8 md:mt-20'>
          <Navigation setAuth={setAuth} />
          <h1 className='text-white text-3xl md:text-5xl animate-fade-down text-center'>Welcome, <span className='text-white'>{name}</span></h1>
          <h2 className='mt-10 md:mt-20 mb-10 text-lg font-bold animate-fade animate-delay-1000'>How are you feeling?</h2>
        </div>

        <div className='w-full max-w-xl'>
          <InputEntry setJournalEntriesUpdate={() => setJournalEntriesUpdate(true)} />
        </div>

        {recentEntry && (
          <div className="mt-8 p-4 bg-midnightp2 rounded-lg animate-fade animate-delay-1000 max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Your Latest Entry:</h3>
            <p>{recentEntry.journalentry_text}</p>
            <p className="mt-2 text-sm opacity-75">
              Mood: {recentEntry.journalentry_mood}
              <img
                src={recentEntry.journalentry_mood === 'NEGATIVE' ? "negative.svg" : "positive.svg"}
                alt={recentEntry.journalentry_mood === 'POSITIVE' ? "Sad Face" : "Smiley Face"}
                className='w-4 h-4 inline-block ml-2'
              />
            </p>
          </div>
        )}

        <div className='mt-8 mb-8'>
        </div>
      </div>
    </div>

  )
}

export default Dashboard