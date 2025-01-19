import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const InputEntry = ({ setJournalEntriesUpdate }: { setJournalEntriesUpdate: (value: boolean) => void }) => {

  const [journalEntry, setJournalEntry] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const body = { journalEntry };
      const response = await axios.post(
        "https://companion-production-fbf6.up.railway.app/dashboard/journalentry",
        body,
        {
          headers: {
            "Content-Type": "application/json",
            "jwt_token": localStorage.token
          }
        });

      const parseResponse = await response.data;
      console.log(parseResponse);

      setJournalEntriesUpdate(true);
      setJournalEntry("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error: any) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    if (!localStorage.token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='w-full max-w-xl px-4 md:px-0 mx-auto'>
      <h1 className='text-base mb-5 animate-fade animate-delay-1000 text-center'>Input an entry below:</h1>
      <form onSubmit={onSubmitForm} className="flex flex-col w-full gap-3 items-center">
        <input
          className='text-md p-3 rounded-md animate-fade animate-delay-1000 text-gray-400 hover:bg-white duration-500 bg-black w-full'
          type='text'
          placeholder='Input here'
          value={journalEntry}
          onChange={e => setJournalEntry(e.target.value)}>
        </input>
        <button className='border-2 px-4 py-2 rounded-md animate-fade animate-delay-1000 hover:bg-midnightp2 transition-colors duration-200'>
          Add
        </button>
      </form>
      {showSuccess && (
        <div className="mt-4 p-2 bg-green-500 text-white rounded-md animate-fade">
          Entry added successfully!
        </div>
      )}
    </div>
  )
}

export default InputEntry
