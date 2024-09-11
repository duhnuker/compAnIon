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
        <h1>Input Journal Entry:</h1>
        <form onSubmit={onSubmitForm}>
          <input
          type='text'
          placeholder='Enter journal entry'
          value={journalEntry}
          onChange={e => setJournalEntry(e.target.value)}>
          </input>
          <button>Add</button>
        </form>
    </div>
  )
}

export default InputEntry