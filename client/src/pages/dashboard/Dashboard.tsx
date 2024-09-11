import { useState, useEffect } from 'react';
import axios from 'axios';

import InputEntry from './journal/InputEntry';
import ListEntries from './journal/ListEntries';

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
    <div>
      <div>
        <h1>Welcome {name}</h1>
        <InputEntry setJournalEntriesUpdate={() => setJournalEntriesUpdate(true)} />
        <ListEntries allJournalEntries={allJournalEntries} setJournalEntriesUpdate={() => setJournalEntriesUpdate(true)} />
        <button
          onClick={e => logout(e)}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard