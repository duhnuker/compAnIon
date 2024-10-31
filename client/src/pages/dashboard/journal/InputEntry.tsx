import axios from 'axios';
import React, { useState } from 'react'

const InputEntry = ({ setJournalEntriesUpdate }: { setJournalEntriesUpdate: (value: boolean) => void }) => {

  const [journalEntry, setJournalEntry] = useState("");

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      const body = { journalEntry };
      const response = await axios.post(
        "http://localhost:5000/dashboard/journalentry",
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


    } catch (error: any) {
      console.error(error.message);
    }

  }

  return (
    <div>
      <h1 className='text-base mb-5 animate-fade animate-delay-1000 text-center'>Input an entry below:</h1>
      <form onSubmit={onSubmitForm} className="flex flex-col sm:flex-row items-center gap-3">
        <input
          className='md:w-[500px] md:h-[50px] rounded-md animate-fade animate-delay-1000 text-gray-400 hover:bg-white duration-500 text-xl bg-black p-2'
          type='text'
          placeholder='Input here'
          value={journalEntry}
          onChange={e => setJournalEntry(e.target.value)}>
        </input>
        <button className='border-2 px-2 py-1 mb-6 rounded-md animate-fade animate-delay-1000 sm:mt-6'>Add</button>
      </form>
    </div>
  )
}

export default InputEntry