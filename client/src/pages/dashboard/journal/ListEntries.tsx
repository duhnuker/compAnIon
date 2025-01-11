import { useState, useEffect } from 'react'
import axios from 'axios';
import EditEntry from './EditEntry';
import '../../../index.css';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const ListEntries = ({ allJournalEntries, setJournalEntriesUpdate }: { allJournalEntries: any[], setJournalEntriesUpdate: () => void }) => {
  const [journalEntries, setJournalEntries] = useState<any[]>([]);

  const getEntries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dashboard/journalentries", {
        headers: { jwt_token: localStorage.token }
      });
      setJournalEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  async function deleteJournalEntry(id: string) {
    try {
      await axios.delete(`http://localhost:5000/dashboard/journalentries/journalentry/${id}`, {
        headers: { jwt_token: localStorage.token }
      });

      setJournalEntries(journalEntries.filter((journalEntry: { journalentry_id: string }) => journalEntry.journalentry_id !== id));
      setJournalEntriesUpdate();

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  }

  useEffect(() => {
    getEntries();
  }, []);

  useEffect(() => {
    setJournalEntries(allJournalEntries);
  }, [allJournalEntries]);

  return (
    <div className='animate-fade animate-delay-1000 overflow-x-auto container mx-auto px-4'>
      <div className="min-w-full">
        {/* Large screens - table view */}
        <table className="hidden md:table w-full mt-5 border-collapse">
          <thead>
            <tr>
              <th className='text-lg p-2 border'>Description</th>
              <th className='text-lg p-2 border'>Mood</th>
              <th className='text-lg p-2 border'>Mood Score</th>
              <th className='text-lg p-2 border'>Date created</th>
              <th className='text-lg p-2 border'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {journalEntries.length !== 0 &&
              journalEntries[0].journalentry_id !== null &&
              journalEntries.map(journalEntry => (
                <tr key={journalEntry.journalentry_id}>
                  <td className='p-2 border'>{journalEntry.journalentry_text}</td>
                  <td className='p-2 border'>{journalEntry.journalentry_mood}
                    <img
                      src={journalEntry.journalentry_mood === 'NEGATIVE' ? "negative.svg" : "positive.svg"}
                      alt={journalEntry.journalentry_mood === 'POSITIVE' ? "Sad Face" : "Smiley Face"}
                      className='w-6 h-6 inline-block mx-2'
                    />
                  </td>
                  <td className='p-2 border text-center'>{journalEntry.journalentry_mood_score}</td>
                  <td className='p-2 border'>{formatDate(journalEntry.journalentry_created_at)}</td>
                  <td className='p-2 border'>
                    <div className='flex flex-row space-x-2 justify-start items-center'>
                      <EditEntry journalEntry={journalEntry} setJournalEntriesUpdate={setJournalEntriesUpdate} />
                      <button
                        className="btn btn-danger border-2 p-1 rounded-md"
                        onClick={() => deleteJournalEntry(journalEntry.journalentry_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Mobile view - card layout */}
        <div className="md:hidden space-y-4 mt-5">
          {journalEntries.length !== 0 &&
            journalEntries[0].journalentry_id !== null &&
            journalEntries.map(journalEntry => (
              <div key={journalEntry.journalentry_id} className="border rounded-lg p-4 shadow-sm">
                <div className="space-y-2">
                  <div className="font-semibold">Description:</div>
                  <div className="pl-2">{journalEntry.journalentry_text}</div>
                  <div className="font-semibold">Mood:</div>
                  <div className="pl-2 flex items-center">
                    {journalEntry.journalentry_mood}
                    <img
                      src={journalEntry.journalentry_mood === 'NEGATIVE' ? "negative.svg" : "positive.svg"}
                      alt={journalEntry.journalentry_mood === 'POSITIVE' ? "Sad Face" : "Smiley Face"}
                      className='w-6 h-6 inline-block mx-2'
                    />
                  </div>
                  <div className="font-semibold">Mood Score:</div>
                  <div className="pl-2">{journalEntry.journalentry_mood_score}</div>

                  <div className="font-semibold">Date:</div>
                  <div className="pl-2">{formatDate(journalEntry.journalentry_created_at)}</div>

                  <div className="flex space-x-2 pt-3">
                    <EditEntry journalEntry={journalEntry} setJournalEntriesUpdate={setJournalEntriesUpdate} />
                    <button
                      className="btn btn-danger border-2 px-1 rounded-md"
                      onClick={() => deleteJournalEntry(journalEntry.journalentry_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ListEntries