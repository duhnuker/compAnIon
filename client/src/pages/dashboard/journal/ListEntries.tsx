import { useState, useEffect } from 'react'
import axios from 'axios';
import EditEntry from './EditEntry';

const ListEntries = ({ allJournalEntries, setJournalEntriesUpdate }: { allJournalEntries: any[], setJournalEntriesUpdate: () => void }) => {

    const [journalEntries, setJournalEntries] = useState<any[]>([]);


    async function deleteJournalEntry(id: string) {
        try {
            
            await axios.delete(`http://localhost:5000/dashboard/journalentry/${id}`,
                {
                    headers: { jwt_token: localStorage.token }
                }
            );
            
            setJournalEntries(journalEntries.filter((journalEntry: { journalentry_id: string }) => journalEntry.journalentry_id !== id));

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }

    useEffect(() => {
        setJournalEntries(allJournalEntries);
    }, [allJournalEntries]);
    
  return (
    <div className='animate-fade animate-delay-1000'>
         <table className="table mt-5">
        <thead>
          <tr>
            <th className='text-lg pr-10'>Description</th>
            <th className='text-lg pr-1'>Mood</th>
          </tr>
        </thead>
        <tbody>
          {journalEntries.length !== 0 &&
            journalEntries[0].journalentry_id !== null &&
            journalEntries.map(journalEntry => (
              <tr key={journalEntry.journalentry_id}>
                <td className='pr-10'>{journalEntry.journalentry_text}</td>
                <td>{journalEntry.journalentry_mood}</td>
                <td className='pl-10 pr-1'>
                  <EditEntry journalEntry={journalEntry} setJournalEntriesUpdate={setJournalEntriesUpdate} />
                </td>
                <td>
                  <button
                    className="btn btn-danger border-2 p-0.5 rounded-md"
                    onClick={() => deleteJournalEntry(journalEntry.journalentry_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListEntries