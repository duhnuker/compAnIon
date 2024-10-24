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
        <h1 className='mb-5 animate-fade animate-delay-1000 text-center'>Input a new journal entry:</h1>
        <form onSubmit={onSubmitForm}>
          <input
          className='w-[500px] h-[30px] rounded-md animate-fade animate-delay-1000 text-black'
          type='text'
          placeholder='Enter journal entry'
          value={journalEntry}
          onChange={e => setJournalEntry(e.target.value)}>
          </input>
          <button className='ml-3 border-2 px-2 py-1 mb-6 rounded-md animate-fade animate-delay-1000'>Add</button>
        </form>
    </div>
  )
}

export default InputEntry