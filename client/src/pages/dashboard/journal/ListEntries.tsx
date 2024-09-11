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
            
            setJournalEntries(journalEntries.filter((journalEntry: { journalEntry_id: string }) => journalEntry.journalEntry_id !== id));

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
    <div>
         <table className="table mt-5">
        <thead>
          <tr>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {journalEntries.length !== 0 &&
            journalEntries[0].journalentry_id_id !== null &&
            journalEntries.map(journalEntry => (
              <tr key={journalEntry.journalEntry_id}>
                <td>{journalEntry.description}</td>
                <td>
                  <EditEntry journalEntry={journalEntry} setJournalEntriesUpdate={setJournalEntriesUpdate} />
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteJournalEntry(journalEntry.journalEntry_id)}
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